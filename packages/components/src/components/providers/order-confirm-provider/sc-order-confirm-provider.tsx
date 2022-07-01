import { Component, h, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import { Order } from '../../../types';
import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { __ } from '@wordpress/i18n';
import { parseFormData } from '../../../functions/form-data';

/**
 * This component listens to the order status
 * and confirms the order when payment is successful.
 */
@Component({
  tag: 'sc-order-confirm-provider',
  shadow: true,
})
export class ScOrderConfirmProvider {
  /** The order confirm provider element */
  @Element() el: HTMLScOrderConfirmProviderElement;

  /** The current order. */
  @Prop() order: Order;

  /** Success url. */
  @Prop() successUrl: string;

  /** Update the order in the universe store. */
  @Event() scUpdateOrderState: EventEmitter<Order>;

  /** The order is confirmed event. */
  @Event() scConfirmed: EventEmitter<void>;

  /** The order is paid event. */
  @Event() scOrderPaid: EventEmitter<Order>;

  /** Error event. */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Listen for paid event. This is triggered by Stripe or Paypal elements when payment succeeds. */
  @Listen('scPaid')
  handlePaidEvent() {
    this.confirmOrder();
  }

  /** Confirm the order. */
  async confirmOrder() {
    const json = await this.el.querySelector('sc-form').getFormJson();
    let data = parseFormData(json);
    try {
      const confirmed = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/orders/${this.order?.id}/confirm`, [expand]),
        data,
      })) as Order;
      // make sure we update the state in the central store.
      this.scUpdateOrderState.emit(confirmed);
      // emit the confirmed event to trigger listeners to redirect to the success url, etc.
      this.scConfirmed.emit();
      // emit the order paid event for tracking scripts.
      this.scOrderPaid.emit(confirmed);
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    } finally {
      // we always want to redirect, regardless of the outcome here.
      window.location.assign(addQueryArgs(this.successUrl, { order: this.order.id }));
    }
  }

  render() {
    return <slot />;
  }
}
