import { Component, Prop, h, Watch, State, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Order, TaxStatus } from '../../../../types';

@Component({
  tag: 'sc-order-shipping-address',
  styleUrl: 'sc-order-shipping-address.scss',
  shadow: true,
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

  /** Is shipping enabled for this order? */
  @Prop() shippingEnabled: boolean;

  /** Make a request to update the order. */
  @Event() scUpdateOrder: EventEmitter<{
    data: Partial<Order>;
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

  /** When the customer shipping address changes, we want to use that instead of what's entered, if we have empty fields. */
  @Watch('customerShippingAddress')
  handleCustomerAddressChange(val, old) {
    // if the shipping address is blank, use the customer address.
    if (!Object.keys(this.shippingAddress || {}).length && !old) {
      this.address = { ...this.address, ...val };
    }
  }

  /** When the shipping address changes, we want to update the passed address to match. */
  @Watch('shippingAddress')
  handleShippingChange(val, old) {
    // let's only update it the first time.
    if (!old) {
      if (!val?.country) {
        const country = navigator?.language?.slice(-2).toUpperCase();
        if (country) {
          this.address = {
            ...this.address,
            country,
          };
        }
      }
      this.address = { ...this.address, ...val };
    }
  }

  updateAddressState(address: Partial<Address>) {
    if (address === this.address) return; // no change, don't update.
    this.address = address;
    this.scUpdateOrder.emit({
      data: {
        shipping_address: this.address as Address,
      },
    });
  }

  componentWillLoad() {
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
    if (this.shippingEnabled) {
      return (
        <sc-address
          label={__('Shipping Address', 'surecart')}
          required={this.required}
          loading={this.loading}
          address={this.address}
          onScChangeAddress={e => this.updateAddressState(e.detail)}
        ></sc-address>
      );
    }
    return (
      <sc-compact-address required={this.required} loading={this.loading} address={this.address} onScChangeAddress={e => this.updateAddressState(e.detail)}></sc-compact-address>
    );
  }
}

openWormhole(ScOrderShippingAddress, ['shippingAddress', 'loading', 'customerShippingAddress', 'taxStatus', 'shippingEnabled'], false);
