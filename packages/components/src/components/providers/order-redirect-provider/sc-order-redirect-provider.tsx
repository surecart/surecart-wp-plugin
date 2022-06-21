import { Component, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import { FormStateSetter, Order } from '../../../types';
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
  @Prop({ reflect: true, mutable: true }) successUrl: string;

  /** Form state event. */
  @Event() scSetState: EventEmitter<FormStateSetter>;

  /** Error event. */
  @Event() scError: EventEmitter<{ message: string; code?: string; data?: any; additional_errors?: any } | {}>;

  /** Listen for when an order comes back as paid, then redirect. */
  @Watch('order')
  handleOrderPaid() {
    if (this.order?.status !== 'paid') return;
    this.scSetState.emit('PAID'); // make sure we are setting the correct state.
    return this.redirect();
  }

  componentDidLoad() {
    const successUrl = getQueryArg(window.location.href, 'success_url') as string;
    if (successUrl) {
      this.successUrl = successUrl;
    }
    this.handleOrderPaid();
  }

  /** Redirect to the success url. */
  redirect() {
    window.location.assign(addQueryArgs(this.successUrl, { order: this.order.id }));
  }

  render() {
    return <slot />;
  }
}
