import { Customer, Order } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-confirmation-customer',
  styleUrl: 'sc-order-confirmation-customer.css',
  shadow: true,
})
export class ScOrderConfirmationCustomer {
  /** The Order */
  @Prop() order: Order;

  /** The heading */
  @Prop() heading: string;

  /** The customer */
  @Prop() customer: Customer;

  /** Error message. */
  @Prop() error: string;

  /** Is this loading? */
  @Prop() loading: boolean;

  render() {
    if (!this.customer) {
      return null;
    }
    return (
      <sc-customer-details customer={this.customer} loading={this.loading} error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Billing Details', 'surecart')}</slot>
        </span>
      </sc-customer-details>
    );
  }
}
openWormhole(ScOrderConfirmationCustomer, ['order', 'customer', 'loading'], false);
