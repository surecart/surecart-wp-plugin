import { Component, Prop, h, Watch, State, Event, EventEmitter } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { isAddressCompleteEnough } from '../../../../functions/address';
import { Address, Order, TaxStatus } from '../../../../types';

@Component({
  tag: 'sc-order-shipping-address',
  styleUrl: 'sc-order-shipping-address.css',
  shadow: false,
})
export class ScOrderShippingAddress {
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

  /** Tax status of the order */
  @Prop() taxStatus: TaxStatus;

  /** Make a request to update the order. */
  @Event() scUpdateOrder: EventEmitter<Partial<Order>>;

  /** Address to pass to the component */
  @State() address: Partial<Address> = {
    country: '',
    city: '',
    line_1: '',
    line_2: '',
    postal_code: '',
    state: '',
  };

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

  updateAddressState(address: Partial<Address>) {
    if (address === this.address) return;
    this.address = address;
    if (isAddressCompleteEnough(this.address) && this.taxStatus !== 'disabled') {
      this.scUpdateOrder.emit({
        shipping_address: this.address as Address,
      });
    }
  }

  componentWillLoad() {
    // if we have a shipping address on load, update the passed address.
    if (this.shippingAddress) {
      this.address = {
        ...(this.shippingAddress?.country ? { county: this.shippingAddress?.country } : {}),
        ...(this.shippingAddress?.state ? { state: this.shippingAddress.state } : {}),
        ...(this.shippingAddress?.city ? { city: this.shippingAddress.city } : {}),
        ...(this.shippingAddress?.postal_code ? { postal_code: this.shippingAddress.postal_code } : {}),
        ...(this.shippingAddress?.line_1 ? { line_1: this.shippingAddress.line_1 } : {}),
      };
    }

    /** Set the country by browser language if not set. */
    if (!this.address?.country) {
      const country = navigator?.language?.slice(-2).toUpperCase();
      if (country) {
        this.address = {
          ...this.address,
          country,
        };
      }
    }
  }

  render() {
    return (
      <sc-address
        label={this.label}
        required={this.required}
        loading={this.loading}
        address={this.address}
        onScChangeAddress={e => this.updateAddressState(e.detail)}
        names={{
          country: 'shipping_country',
          line_1: 'shipping_line_1',
          line_2: 'shipping_line_2',
          city: 'shipping_city',
          postal_code: 'shipping_postal_code',
          state: 'shipping_state',
        }}
      ></sc-address>
    );
  }
}

openWormhole(ScOrderShippingAddress, ['shippingAddress', 'loading', 'customerShippingAddress', 'taxStatus'], false);
