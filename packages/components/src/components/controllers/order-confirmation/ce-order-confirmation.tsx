import { Component, Host, State, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import { Universe } from 'stencil-wormhole';
import apiFetch from '../../../functions/fetch';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-order-confirmation',
  styleUrl: 'ce-order-confirmation.css',
  shadow: true,
})
export class CeOrderConfirmation {
  /** Stores the current CheckoutSession */
  @State() checkoutSession: CheckoutSession;

  /** Loading */
  @State() loading: boolean = false;

  /** Error */
  @State() error: string;

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());
    // get teh session
    this.getSession();
  }

  /** Get session id from url. */
  getSessionId() {
    return getQueryArg(window.location.href, 'checkout_session');
  }

  /** Update a session */
  async getSession() {
    console.log(window.location.href);
    if (!this.getSessionId()) return;
    try {
      this.loading = true;
      this.checkoutSession = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/checkout_sessions/${this.getSessionId()}`, {
          expand: ['line_items', 'line_item.price', 'price.product', 'customer', 'payment_intent', 'discount', 'discount.promotion', 'billing_address', 'shipping_address'],
          refresh_status: true,
        }),
      })) as CheckoutSession;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
    } finally {
      this.loading = false;
    }
  }

  state() {
    return {
      processor: 'stripe',
      loading: this.loading,
      checkoutSession: this.checkoutSession,
    };
  }

  render() {
    return (
      <Host>
        <slot></slot>
        <h1>Work in Progress</h1>
        {this.checkoutSession?.billing_addresss?.name}
        {JSON.stringify(this.checkoutSession)}
      </Host>
    );
  }
}
