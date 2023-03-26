import { Component, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { __ } from '@wordpress/i18n';
import { createOrUpdateCheckout } from '../../../../services/session';
import { openWormhole } from 'stencil-wormhole';

import { Address, Checkout, TaxStatus } from '../../../../types';

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
  @Prop({ mutable: true }) required: boolean = false;

  /** Is this loading. */
  @Prop() loading: boolean;

  /** Holds the customer's billing address */
  @Prop() shippingAddress: Address;

  /** Tax status of the order */
  @Prop() taxStatus: TaxStatus;

  /** Tax enabled status of the order */
  @Prop() taxEnabled: boolean;

  /** Is shipping enabled for this order? */
  @Prop() shippingEnabled: boolean;

  /** Show the full address */
  @Prop() full: boolean;

  /** Show the name field. */
  @Prop() showName: boolean;

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

  /** Make a request to update the order. */
  @Event() scUpdateOrder: EventEmitter<{
    data: Partial<Checkout>;
    options?: { silent?: boolean };
  }>;

  /** Address to pass to the component */
  @State() address: Partial<Address> = {
    country: null,
    city: null,
    line_1: null,
    line_2: null,
    postal_code: null,
    state: null,
  };

  /** When the shipping address changes, we want to use that instead of what's entered, if we have empty fields. */
  @Watch('shippingAddress')
  handleCustomerAddressChange(val, old) {
    if (val?.id && !old) {
      this.address = { ...this.address, ...val };
    }
  }

  async updateAddressState(address: Partial<Address>) {
    if (JSON.stringify(address) === JSON.stringify(this.address)) return; // no change, don't update.
    this.address = address;
    try {
      lockCheckout('shipping-address');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
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
    return this.input.reportValidity();
  }

  componentWillLoad() {
    if (this.defaultCountry && !this.address.country) {
      this.address.country = this.defaultCountry;
    }

    this.handleRequirementChange();
  }

  @Watch('shippingEnabled')
  @Watch('taxEnabled')
  handleRequirementChange() {
    if (this.shippingEnabled || this.taxEnabled) {
      this.required = true;
    }
  }

  render() {
    if (this.shippingEnabled || this.full) {
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
          required={this.required}
          loading={this.loading}
          address={this.address}
          show-name={this.showName}
          onScChangeAddress={e => this.updateAddressState(e.detail)}
        ></sc-address>
      );
    }
    return (
      <sc-compact-address
        ref={el => (this.input = el as any)}
        required={this.required}
        loading={this.loading}
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
        label={this.label}
        onScChangeAddress={e => this.updateAddressState(e.detail)}
      ></sc-compact-address>
    );
  }
}

openWormhole(ScOrderShippingAddress, ['shippingAddress', 'loading', 'taxStatus', 'taxEnabled', 'shippingEnabled'], false);
