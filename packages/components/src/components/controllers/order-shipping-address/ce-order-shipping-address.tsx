import { Component, Prop, h, Watch, State } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Address } from '../../../types';

@Component({
  tag: 'ce-order-shipping-address',
  styleUrl: 'ce-order-shipping-address.css',
  shadow: false,
})
export class CeOrderShippingAddress {
  /** Label for the field. */
  @Prop() label: string;

  /** Is this required (defaults to true) */
  @Prop() required: boolean = true;

  /** Is this loading. */
  @Prop() loading: boolean;

  /** Holds the customer's shipping address */
  @Prop() customerShippingAddress: Address;

  /** Holds the customer's billing address */
  @Prop() shippingAddress: Address;

  /** Address to pass to the component */
  @State() address: Address;

  /** When the customer shipping address changes, we want to use that instead of what's entered, if we have empty fields. */
  @Watch('customerShippingAddress')
  handleCustomerAddressChange(val, old) {
    if (!Object.keys(this.shippingAddress || {}).length) {
      // update local address if changes.
      Object.keys(this.address).forEach(key => {
        if (val?.[key] !== old?.[key]) {
          if (!val?.[key]) return; // don't allow resetting to empty.
          this.address = { ...this.address, [key]: val?.[key] };
        }
      });
    }
  }

  /** When the shipping address changes, we want to update the passed address to match. */
  @Watch('shippingAddress')
  handleShippingChange(val, old) {
    // update local address if changes.
    Object.keys(this.address).forEach(key => {
      if (val?.[key] !== old?.[key]) {
        if (!val?.[key]) return; // don't allow resetting to empty.
        this.address = { ...this.address, [key]: val?.[key] };
      }
    });
  }

  componentWillLoad() {
    // if we have a shipping address on load, update the passed address.
    if (this.shippingAddress) {
      this.address = {
        ...(this.shippingAddress.state ? { state: this.shippingAddress.state } : {}),
        ...(this.shippingAddress.city ? { city: this.shippingAddress.city } : {}),
        ...(this.shippingAddress.postal_code ? { postal_code: this.shippingAddress.postal_code } : {}),
        ...(this.shippingAddress.line_1 ? { line_1: this.shippingAddress.line_1 } : {}),
      };
    }

    /** Set the country by browser language if not set. */
    if (!this.address.country) {
      const country = navigator?.language?.slice(-2);
      if (country) {
        this.address.country = country;
      }
    }
  }

  render() {
    return (
      <ce-address
        label={this.label}
        required={this.required}
        loading={this.loading}
        address={this.address}
        names={{
          country: 'shipping_country',
          line_1: 'shipping_line_1',
          line_2: 'shipping_line_2',
          city: 'shipping_city',
          postal_code: 'shipping_postal_code',
          state: 'shipping_state',
        }}
      ></ce-address>
    );
  }
}

openWormhole(CeOrderShippingAddress, ['shippingAddress', 'loading', 'customerShippingAddress'], false);
