import { Component, Element, Event, EventEmitter, h, Listen, Prop } from '@stencil/core';
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
      // make sure form state changes before redirecting
      setTimeout(() => {
        // make sure we clear the order state no matter what.
        clearOrder(this.formId, this.mode);
        window.location.assign(addQueryArgs(this?.order?.metadata?.success_url || this.successUrl, { order }));
      }, 50);
    }
  }

  render() {
    return <slot />;
  }
}
