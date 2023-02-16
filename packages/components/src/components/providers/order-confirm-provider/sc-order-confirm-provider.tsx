import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { clearOrder } from '../../../store/checkouts';
import { Checkout } from '../../../types';

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

  /**Whether the success modal is open */
  @State() isSuccessModalOpen: boolean = false;

  /**The current order id */
  @State() orderId: string = '';

  /** The form id */
  @Prop() formId: number;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The current order. */
  @Prop() order: Checkout;

  /** Success url. */
  @Prop() successUrl: string;

  /** The order is paid event. */
  @Event() scOrderPaid: EventEmitter<Checkout>;

  @Event() scSetState: EventEmitter<string>;

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
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/checkouts/${this.order?.id}/confirm`, [expand]),
      })) as Checkout;
      this.scSetState.emit('CONFIRMED');
      // emit the order paid event for tracking scripts.
      this.scOrderPaid.emit(confirmed);
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    } finally {
      // we always want to redirect, regardless of the outcome here.
      const order = this.order?.id;

      if (this?.order?.metadata?.success_url) {
        this.orderSuccessUrl = addQueryArgs(this?.order?.metadata?.success_url, { order });
      }
      // make sure form state changes before redirecting
      setTimeout(() => {
        // make sure we clear the order state no matter what.
        clearOrder(this.formId, this.mode);
        this.isSuccessModalOpen = true;
      }, 50);
    }
  }

  getSuccessUrl() {
    if (this?.order?.metadata?.success_url || this.successUrl) {
      const success_url = this?.order?.metadata?.success_url || this.successUrl;
      return addQueryArgs(success_url, { order: this.orderId });
    }
  }

  render() {
    return (
      <Host>
        <slot />
        <order-confirm-modal open={this.isSuccessModalOpen} successUrl={this.getSuccessUrl()}></order-confirm-modal>
      </Host>
    );
  }
}
