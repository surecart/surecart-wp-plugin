import { Component, Element, Event, EventEmitter, h, Listen, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs, getQueryArg, removeQueryArgs } from '@wordpress/url';

import apiFetch from '../../../functions/fetch';
import { parseFormData } from '../../../functions/form-data';
import { expand } from '../../../services/session';
import { clearOrder } from '../../../store/checkouts';
import { Order } from '../../../types';

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
  @Prop() order: Order;

  /** Success url. */
  @Prop() successUrl: string;

  /** The order is paid event. */
  @Event() scOrderPaid: EventEmitter<Order>;

  @Event() scSetState: EventEmitter<string>;

  /** Error event. */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Listen for paid event. This is triggered by Stripe or Paypal elements when payment succeeds. */
  @Listen('scPaid')
  handlePaidEvent() {
    this.confirmOrder();
  }

  componentDidLoad() {
    this.checkRedirectParams();
  }

  checkRedirectParams() {
    const status = getQueryArg(window.location.href, 'redirect_status');
    if (status === 'succeeded') {
      // paid state.
      this.scSetState.emit('PAID');
      // so the back button does not re-confirm.
      window.history.replaceState({}, document.title, removeQueryArgs(window.location.href, 'redirect_status'));
      // confirm order
      this.confirmOrder();
    }
  }

  /** Confirm the order. */
  async confirmOrder() {
    const json = await this.el.querySelector('sc-form').getFormJson();
    let data = parseFormData(json);
    try {
      const confirmed = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/checkouts/${this.order?.id}/confirm`, [expand]),
        data,
      })) as Order;
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
        window.location.assign(addQueryArgs(this.successUrl, { order }));
      }, 50);
    }
  }

  render() {
    return <slot />;
  }
}
