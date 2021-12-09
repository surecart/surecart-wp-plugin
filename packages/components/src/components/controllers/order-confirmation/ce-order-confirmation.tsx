import { Component, State, h, Prop } from '@stencil/core';
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
  @Prop({ mutable: true }) checkoutSession: CheckoutSession;

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
    if (this.checkoutSession?.id) return this.checkoutSession.id;
    return getQueryArg(window.location.href, 'checkout_session');
  }

  /** Update a session */
  async getSession() {
    if (!this.getSessionId()) return;
    if (this.checkoutSession?.id) return;
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
      checkoutSessionId: this.getSessionId(),
      checkoutSession: this.checkoutSession,
    };
  }

  render() {
    return (
      <Universe.Provider state={this.state()}>
        <div class={{ 'order-confirmation': true }}>
          <div
            class={{
              'order-confirmation__content': true,
              'hidden': !this.checkoutSession?.id && !this.loading,
            }}
          >
            <slot />
          </div>
          {!this.checkoutSession?.id && !this.loading && (
            <ce-heading>
              {__('Order not found.', 'checkout_engine')}
              <span slot="description">{__('This order could not be found. Please try again.', 'checkout_engine')}</span>
            </ce-heading>
          )}
        </div>
      </Universe.Provider>
    );
  }
}
