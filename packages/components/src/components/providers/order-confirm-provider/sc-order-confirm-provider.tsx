import { Component, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import { Order } from '../../../types';
import apiFetch from '../../../functions/fetch';
import { __ } from '@wordpress/i18n';

/**
 * This component listens to the order status
 * and confirms the order when payment is successful.
 */
@Component({
  tag: 'sc-order-confirm-provider',
  shadow: true,
})
export class ScOrderConfirmProvider {
  /** The current order. */
  @Prop() order: Order;

  /** Update the order in the universe store. */
  @Event() scUpdateOrderState: EventEmitter<Order>;

  /** The order is confirmed event. */
  @Event() scConfirmed: EventEmitter<void>;

  /** Error event. */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Listen for paid event. This is triggered by Stripe or Paypal elements when payment succeeds. */
  @Listen('scPaid')
  handlePaidEvent() {
    this.confirmOrder();
  }

  /** Confirm the order. */
  async confirmOrder() {
    try {
      const confirmed = (await apiFetch({
        path: addQueryArgs(`surecart/v1/orders/${this.order?.id}/confirm`),
      })) as Order;
      // make sure we update the state in the central store.
      this.scUpdateOrderState.emit(confirmed);
      // emit the confirmed event to trigger listeners to redirect to the success url, etc.
      this.scConfirmed.emit();
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    }
  }

  render() {
    return <slot />;
  }
}
