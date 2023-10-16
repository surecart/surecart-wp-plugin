import { Component, Element, Event, EventEmitter, h, Host, Watch, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { state as checkoutState } from '@store/checkout';
import { state as formState } from '@store/form';
import { Checkout, ManualPaymentMethod, Product } from '../../../types';
import { clearCheckout } from '@store/checkout/mutations';
import { maybeConvertAmount } from '../../../functions/currency';
import { createErrorNotice } from '@store/notices/mutations';

/**
 * This component listens to the order status
 * and confirms the order when payment is successful.
 */
@Component({
  tag: 'sc-order-confirm-provider',
  styleUrl: 'sc-order-confirm-provider.scss',
  shadow: true,
})
export class ScOrderConfirmProvider {
  /** The order confirm provider element */
  @Element() el: HTMLScOrderConfirmProviderElement;

  /** Whether to show success modal */
  @State() showSuccessModal: boolean = false;

  @State() confirmedCheckout: Checkout;

  /** Checkout status to listen and do payment related stuff. */
  @Prop() checkoutStatus: string;

  /** Success url. */
  @Prop() successUrl: string;

  /** The order is paid event. */
  @Event() scOrderPaid: EventEmitter<Checkout>;

  @Event() scSetState: EventEmitter<string>;

  /**
   * Watch for paid checkout machine state.
   * This is triggered by Stripe, Paypal or Paystack when payment succeeds.
   */
  @Watch('checkoutStatus')
  handleConfirmOrderEvent() {
    if (this.checkoutStatus === 'confirming') {
      this.confirmOrder();
    }
  }

  /** Confirm the order. */
  async confirmOrder() {
    try {
      this.confirmedCheckout = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/checkouts/${checkoutState?.checkout?.id}/confirm`, { expand }),
      })) as Checkout;
      this.scSetState.emit('CONFIRMED');
      // emit the order paid event for tracking scripts.
      this.scOrderPaid.emit(this.confirmedCheckout);
      this.doGoogleAnalytics();
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
    } finally {
      // always clear the checkout.
      clearCheckout();
      // get success url.
      const successUrl = this.confirmedCheckout?.metadata?.success_url || this.successUrl;
      if (successUrl) {
        // set state to redirecting.
        this.scSetState.emit('REDIRECT');
        setTimeout(() => window.location.assign(addQueryArgs(successUrl, { sc_order: this.confirmedCheckout?.id })), 50);
      } else {
        this.showSuccessModal = true;
      }
    }
  }

  doGoogleAnalytics() {
    if (!window?.dataLayer && !window?.gtag) return;

    const data = {
      transaction_id: this.confirmedCheckout?.id,
      value: maybeConvertAmount(this.confirmedCheckout?.total_amount, this.confirmedCheckout?.currency || 'USD'),
      currency: (this.confirmedCheckout.currency || '').toUpperCase(),
      ...(this.confirmedCheckout?.discount?.promotion?.code ? { coupon: this.confirmedCheckout?.discount?.promotion?.code } : {}),
      ...(this.confirmedCheckout?.tax_amount ? { tax: maybeConvertAmount(this.confirmedCheckout?.tax_amount, this.confirmedCheckout?.currency || 'USD') } : {}),
      items: (this.confirmedCheckout?.line_items?.data || []).map(item => ({
        item_name: (item?.price?.product as Product)?.name || '',
        discount: item?.discount_amount ? maybeConvertAmount(item?.discount_amount || 0, this.confirmedCheckout?.currency || 'USD') : 0,
        price: maybeConvertAmount(item?.price?.amount || 0, this.confirmedCheckout?.currency || 'USD'),
        quantity: item?.quantity || 1,
      })),
    };

    // handle gtag (analytics script.)
    if (window?.gtag) {
      window.gtag('event', 'purchase', data);
    }

    // handle dataLayer (google tag manager).
    if (window?.dataLayer) {
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: data,
      });
    }
  }

  getSuccessUrl() {
    const url = this.confirmedCheckout?.metadata?.success_url || this.successUrl;
    return url ? addQueryArgs(url, { sc_order: this.confirmedCheckout?.id }) : window?.scData?.pages?.dashboard;
  }

  render() {
    const manualPaymentMethod = this.confirmedCheckout?.manual_payment_method as ManualPaymentMethod;

    return (
      <Host>
        <slot />
        <sc-dialog open={!!this.showSuccessModal} style={{ '--body-spacing': 'var(--sc-spacing-xxx-large)' }} noHeader onScRequestClose={e => e.preventDefault()}>
          <div class="confirm__icon">
            <div class="confirm__icon-container">
              <sc-icon name="check" />
            </div>
          </div>
          <sc-dashboard-module
            heading={formState?.text?.success?.title || __('Thanks for your order!', 'surecart')}
            style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}
          >
            <span slot="description">
              {formState?.text?.success?.description || __('Your payment was successful, and your order is complete. A receipt is on its way to your inbox.', 'surecart')}
            </span>
            {!!manualPaymentMethod?.name && !!manualPaymentMethod?.instructions && (
              <sc-alert type="info" open style={{ 'text-align': 'left' }}>
                <span slot="title">{manualPaymentMethod?.name}</span>
                {manualPaymentMethod?.instructions.split('\n').map(i => {
                  return <p>{i}</p>;
                })}
              </sc-alert>
            )}
            <sc-button href={this.getSuccessUrl()} size="large" type="primary">
              {formState?.text?.success?.button || __('Continue', 'surecart')}
              <sc-icon name="arrow-right" slot="suffix" />
            </sc-button>
          </sc-dashboard-module>
        </sc-dialog>
      </Host>
    );
  }
}
