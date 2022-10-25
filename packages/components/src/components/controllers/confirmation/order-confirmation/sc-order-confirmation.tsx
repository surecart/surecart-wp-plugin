import apiFetch from '../../../../functions/fetch';
import { Checkout, ManualPaymentMethod } from '../../../../types';
import { Component, State, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import { Universe } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-confirmation',
  styleUrl: 'sc-order-confirmation.css',
  shadow: true,
})
export class ScOrderConfirmation {
  @Prop({ mutable: true }) order: Checkout;

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
        path: addQueryArgs(`surecart/v1/checkouts/${this.getSessionId()}`, {
          expand: [
            'line_items',
            'line_item.price',
            'price.product',
            'customer',
            'customer.shipping_address',
            'payment_intent',
            'discount',
            'manual_payment_method',
            'discount.promotion',
            'billing_address',
            'shipping_address',
          ],
          refresh_status: true,
        }),
      })) as Checkout;
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
    const manualPaymentMethod = this.order?.manual_payment_method as ManualPaymentMethod;
    console.log(manualPaymentMethod);
    return {
      processor: 'stripe',
      loading: this.loading,
      orderId: this.getSessionId(),
      order: this.order,
      customer: this.order?.customer,
      manualPaymentTitle: manualPaymentMethod?.name,
      manualPaymentInstructions: manualPaymentMethod?.instructions,
    };
  }

  renderOnHold() {
    if (this.order?.status !== 'requires_approval') return null;
    if (this?.order?.payment_intent?.processor_type === 'paypal') {
      return (
        <sc-alert type="warning" open={true}>
          {__('Paypal is taking a closer look at this payment. It’s required for some payments and normally takes up to 3 business days.', 'surecart')}
        </sc-alert>
      );
    }
  }

  renderManualInstructions() {
    const paymentMethod = this.order?.manual_payment_method as ManualPaymentMethod;
    if (!paymentMethod?.instructions) return;
    return (
      <sc-alert type="info" open>
        <span slot="title">{paymentMethod?.name}</span>
        {paymentMethod?.instructions}
      </sc-alert>
    );
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
            <sc-order-manual-instructions></sc-order-manual-instructions>
            <slot />
          </div>

          {!this.order?.id && !this.loading && (
            <sc-heading>
              {__('Order not found.', 'surecart')}
              <span slot="description">{__('This order could not be found. Please try again.', 'surecart')}</span>
            </sc-heading>
          )}
        </div>
      </Universe.Provider>
    );
  }
}
