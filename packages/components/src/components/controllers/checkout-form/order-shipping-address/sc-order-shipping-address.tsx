import { Component, Prop, h, Watch, State, Event, EventEmitter, Method } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Address, Order, TaxStatus } from '../../../../types';

@Component({
  tag: 'sc-order-shipping-address',
  styleUrl: 'sc-order-shipping-address.scss',
  shadow: true,
})
export class ScOrderShippingAddress {
  private input: HTMLScAddressElement | HTMLScCompactAddressElement;

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

  /** Show the full address */
  @Prop() full: boolean;

  /** Show the name field. */
  @Prop() showName: boolean;

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

  updateAddressState(address: Partial<Address>) {
    if (JSON.stringify(address) === JSON.stringify(this.address)) return; // no change, don't update.
    this.address = address;
    this.scUpdateOrder.emit({
      data: {
        shipping_address: this.address as Address,
      },
    });
  }

  @Method()
  async reportValidity() {
    return this.input.reportValidity();
  }

  render() {
    if (this.shippingEnabled || this.full) {
      return (
        <sc-address
          ref={el => (this.input = el as any)}
          label={this.label || __('Shipping Address', 'surecart')}
          placeholders={this.placeholders}
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
        onScChangeAddress={e => this.updateAddressState(e.detail)}
      ></sc-compact-address>
    );
  }
}

openWormhole(ScOrderShippingAddress, ['shippingAddress', 'loading', 'customerShippingAddress', 'taxStatus', 'shippingEnabled'], false);
