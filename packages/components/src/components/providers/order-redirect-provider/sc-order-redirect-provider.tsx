import { Component, h, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import { Order } from '../../../types';
import { __ } from '@wordpress/i18n';

/**
 * This component listens for a confirmed event and redirects to the success url.
 */
@Component({
  tag: 'sc-order-redirect-provider',
  shadow: true,
})
export class ScOrderRedirectProvider {
  /** The current order. */
  @Prop() order: Order;

  /** The success url. */
  @Prop() successUrl: string;

  /** The order is confirmed event. */
  @Event() scConfirmed: EventEmitter<void>;

  /** Error event. */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Listen for paid event. This is triggered by Stripe or Paypal elements when payment succeeds. */
  @Listen('scConfirmed')
  handleConfirmedEvent() {
    // order status must be paid at this point.
    if (this.order?.status === 'paid') {
      return this.redirect();
    }

    // something went wrong and the order did not sync.
    this.scError.emit({
      code: 'confirm_failed',
      message: __('Something went wrong. Please contact us for support.', 'surecart'),
    });
  }

  /** Redirect to the success url. */
  redirect() {
    window.location.assign(addQueryArgs(this.successUrl, { order: this.order.id }));
  }

  render() {
    return <slot />;
  }
}
