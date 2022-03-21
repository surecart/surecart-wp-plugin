import apiFetch from '../../../../functions/fetch';
import { Order } from '../../../../types';
import { Component, State, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import { Universe } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-confirmation',
  styleUrl: 'ce-order-confirmation.css',
  shadow: true,
})
export class CeOrderConfirmation {
  @Prop({ mutable: true }) order: Order;

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
    if (this.order?.id) return this.order.id;
    return getQueryArg(window.location.href, 'order');
  }

  /** Update a session */
  async getSession() {
    if (!this.getSessionId()) return;
    if (this.order?.id) return;
    try {
      this.loading = true;
      this.order = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/orders/${this.getSessionId()}`, {
          expand: [
            'line_items',
            'line_item.price',
            'price.product',
            'customer',
            'customer.shipping_address',
            'payment_intent',
            'discount',
            'discount.promotion',
            'billing_address',
            'shipping_address',
          ],
          refresh_status: true,
        }),
      })) as Order;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
    } finally {
      this.loading = false;
    }
  }

  state() {
    return {
      processor: 'stripe',
      loading: this.loading,
      orderId: this.getSessionId(),
      order: this.order,
      customer: this.order?.customer,
    };
  }

  render() {
    return (
      <Universe.Provider state={this.state()}>
        <div class={{ 'order-confirmation': true }}>
          <div
            class={{
              'order-confirmation__content': true,
              'hidden': !this.order?.id && !this.loading,
            }}
          >
            <slot />
          </div>
          {!this.order?.id && !this.loading && (
            <ce-heading>
              {__('Order not found.', 'surecart')}
              <span slot="description">{__('This order could not be found. Please try again.', 'surecart')}</span>
            </ce-heading>
          )}
        </div>
      </Universe.Provider>
    );
  }
}
