import { Component, Fragment, h, Method, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Address, Checkout } from '../../../../types';
import { state as checkoutState, onChange } from '@store/checkout';
import { formLoading } from '@store/form/getters';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { createOrUpdateCheckout } from '@services/session';
import { ScSwitchCustomEvent } from 'src/components';

@Component({
  tag: 'sc-order-billing-address',
  styleUrl: 'sc-order-billing-address.scss',
  shadow: true,
})
export class ScOrderBillingAddress {
  private input: HTMLScAddressElement | HTMLScCompactAddressElement;

  /** Label for the field */
  @Prop() label: string;

  /** Is this required (defaults to false) */
  @Prop({ mutable: true, reflect: true }) required = false;

  /** Show the name field */
  @Prop({ reflect: true }) showName: boolean;

  /** Name placeholder */
  @Prop() namePlaceholder: string = __('Name or Company Name', 'surecart');

  /** Country placeholder */
  @Prop() countryPlaceholder: string = __('Country', 'surecart');

  /** City placeholder */
  @Prop() cityPlaceholder: string = __('City', 'surecart');

  /** Address placeholder */
  @Prop() line1Placeholder: string = __('Address', 'surecart');

  /** Address Line 2 placeholder */
  @Prop() line2Placeholder: string = __('Address Line 2', 'surecart');

  /** Postal Code placeholder */
  @Prop() postalCodePlaceholder: string = __('Postal Code/Zip', 'surecart');

  /** State placeholder */
  @Prop() statePlaceholder: string = __('State/Province/Region', 'surecart');

  /** Default country for address */
  @Prop() defaultCountry: string;

  /** Toggle label */
  @Prop() toggleLabel: string = __('Billing address same as shipping address.', 'surecart');

  /** Address to pass to the component */
  @State() address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  /** Whether billing address is same as shipping address */
  @State() sameAsShipping = true;

  @Method()
  async reportValidity() {
    return this.input.reportValidity();
  }

  componentWillLoad() {
    if (this.defaultCountry && !this.address.country) {
      this.address.country = this.defaultCountry;
    }

    onChange('checkout', () => {
      const addressKeys = Object.keys(this.address).filter(key => key !== 'country');
      const emptyAddressKeys = addressKeys.filter(key => !this.address[key]);
      this.sameAsShipping = JSON.stringify(checkoutState.checkout?.billing_address) === JSON.stringify(checkoutState.checkout?.shipping_address);

      if (emptyAddressKeys.length === addressKeys.length) {
        this.address = {
          ...this.address,
          ...(checkoutState.checkout?.billing_address as Address),
        };
      }
    });

    this.sameAsShipping = this.shippingAddressFieldExists();
  }

  async updateAddressState(address: Partial<Address>) {
    if (JSON.stringify(address) === JSON.stringify(this.address)) return; // no change, don't update.
    this.address = address;
    try {
      lockCheckout('billing-address');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: {
          billing_address: this.address as Address,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
    } finally {
      unLockCheckout('billing-address');
    }
  }

  onToggleSameAsShipping(e: ScSwitchCustomEvent<void>) {
    this.sameAsShipping = e.target.checked;

    if (this.sameAsShipping) {
      checkoutState.checkout.billing_address = checkoutState.checkout.shipping_address;
      return;
    }

    checkoutState.checkout.billing_address = {
      ...(checkoutState?.checkout?.billing_address as Address),
      ...this.address,
    };
  }

  shippingAddressFieldExists() {
    return !!document.querySelector('sc-order-shipping-address');
  }

  render() {
    return (
      <Fragment>
        {this.shippingAddressFieldExists() && (
          <sc-switch class="order-billing-address__toggle" onScChange={e => this.onToggleSameAsShipping(e)} checked={this.sameAsShipping}>
            {this.toggleLabel}
          </sc-switch>
        )}

        {!this.sameAsShipping && (
          <sc-address
            exportparts="label, help-text, form-control, input__base, select__base, columns, search__base, menu__base"
            ref={el => {
              this.input = el;
            }}
            label={this.label || __('Billing Address', 'surecart')}
            placeholders={{
              name: this.namePlaceholder,
              country: this.countryPlaceholder,
              city: this.cityPlaceholder,
              line_1: this.line1Placeholder,
              line_2: this.line2Placeholder,
              postal_code: this.postalCodePlaceholder,
              state: this.statePlaceholder,
            }}
            required={this.required}
            loading={formLoading()}
            address={this.address}
            show-name={this.showName}
            onScChangeAddress={e => this.updateAddressState(e.detail)}
          />
        )}
      </Fragment>
    );
  }
}
