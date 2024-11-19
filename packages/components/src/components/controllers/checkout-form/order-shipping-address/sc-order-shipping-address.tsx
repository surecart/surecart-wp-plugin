import { Component, h, Method, Prop, State } from '@stencil/core';
import { state as checkoutState, onChange } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { __ } from '@wordpress/i18n';
import { createOrUpdateCheckout } from '../../../../services/session';

import { Address, Checkout } from '../../../../types';
import { fullShippingAddressRequired, shippingAddressRequired } from '@store/checkout/getters';
import { formLoading } from '@store/form/getters';

@Component({
  tag: 'sc-order-shipping-address',
  styleUrl: 'sc-order-shipping-address.scss',
  shadow: true,
})
export class ScOrderShippingAddress {
  private input: HTMLScAddressElement | HTMLScCompactAddressElement;

  /** Label for the field. */
  @Prop() label: string;

  /** Is this required (defaults to false) */
  @Prop({ mutable: true, reflect: true }) required: boolean = false;

  /** Show the   address */
  @Prop({ mutable: true }) full: boolean;

  /** Show the name field. */
  @Prop({ reflect: true }) showName: boolean;

  /** Show the placeholder fields. */
  @Prop() namePlaceholder: string = __('Name or Company Name', 'surecart');
  @Prop() countryPlaceholder: string = __('Country', 'surecart');
  @Prop() cityPlaceholder: string = __('City', 'surecart');
  @Prop() line1Placeholder: string = __('Address', 'surecart');
  @Prop() line2Placeholder: string = __('Address Line 2', 'surecart');
  @Prop() postalCodePlaceholder: string = __('Postal Code/Zip', 'surecart');
  @Prop() statePlaceholder: string = __('State/Province/Region', 'surecart');

  /** Default country for address */
  @Prop() defaultCountry: string;

  /** Whether to require the name in the address */
  @Prop({ reflect: true }) requireName: boolean = false;

  /** Placeholder values. */
  @Prop() placeholders: Partial<Address> = {
    name: __('Name or Company Name', 'surecart'),
    country: __('Country', 'surecart'),
    city: __('City', 'surecart'),
    line_1: __('Address', 'surecart'),
    line_2: __('Address Line 2', 'surecart'),
    postal_code: __('Postal Code/Zip', 'surecart'),
    state: __('State/Province/Region', 'surecart'),
  };

  /** Address to pass to the component */
  @State() address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  /** Names for the address */
  names = {
    name: 'shipping_name',
    country: 'shipping_country',
    city: 'shipping_city',
    line_1: 'shipping_line_1',
    line_2: 'shipping_line_2',
    postal_code: 'shipping_postal_code',
    state: 'shipping_state',
  };

  async updateAddressState(address: Partial<Address>) {
    if (JSON.stringify(address) === JSON.stringify(this.address)) return; // no change, don't update.
    this.address = address;
    try {
      lockCheckout('shipping-address');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout?.id,
        data: {
          shipping_address: this.address as Address,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
    } finally {
      unLockCheckout('shipping-address');
    }
  }

  @Method()
  async reportValidity() {
    if (!this.input) return true;
    return this.input?.reportValidity?.();
  }

  prefillAddress() {
    // check if address keys are empty, if so, update them.
    const addressKeys = Object.keys(this.address).filter(key => key !== 'country');
    const emptyAddressKeys = addressKeys.filter(key => !this.address[key]);
    if (emptyAddressKeys.length === addressKeys.length) {
      this.address = { ...this.address, ...(checkoutState.checkout?.shipping_address as Address) };
    }
  }

  componentWillLoad() {
    if (this.defaultCountry && !this.address?.country) {
      this.address.country = this.defaultCountry;
    }

    this.prefillAddress();
    onChange('checkout', () => this.prefillAddress());
  }

  render() {
    // use full if checkout requires it, it's set, or we're showing/requiring name field.
    if (fullShippingAddressRequired() || this.full || this.requireName || this.showName) {
      return (
        <sc-address
          exportparts="label, help-text, form-control, input__base, select__base, columns, search__base, menu__base"
          ref={el => (this.input = el as any)}
          label={this.label || __('Shipping Address', 'surecart')}
          placeholders={{
            name: this.namePlaceholder,
            country: this.countryPlaceholder,
            city: this.cityPlaceholder,
            line_1: this.line1Placeholder,
            line_2: this.line2Placeholder,
            postal_code: this.postalCodePlaceholder,
            state: this.statePlaceholder,
          }}
          names={this.names}
          required={this.required || shippingAddressRequired()}
          loading={formLoading()}
          address={this.address}
          show-name={this.showName}
          require-name={this.requireName}
          onScChangeAddress={e => this.updateAddressState(e.detail)}
        ></sc-address>
      );
    }
    return (
      <sc-compact-address
        ref={el => (this.input = el as any)}
        required={this.required || shippingAddressRequired()}
        loading={formLoading()}
        address={this.address}
        placeholders={{
          name: this.namePlaceholder,
          country: this.countryPlaceholder,
          city: this.cityPlaceholder,
          line_1: this.line1Placeholder,
          line_2: this.line2Placeholder,
          postal_code: this.postalCodePlaceholder,
          state: this.statePlaceholder,
        }}
        names={this.names}
        label={this.label}
        onScChangeAddress={e => this.updateAddressState(e.detail)}
      ></sc-compact-address>
    );
  }
}
