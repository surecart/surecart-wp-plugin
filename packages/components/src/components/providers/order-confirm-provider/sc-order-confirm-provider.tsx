import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { state as checkoutState } from '@store/checkout';
import { Checkout, ManualPaymentMethod } from '../../../types';
import { clearCheckout } from '@store/checkout/mutations';

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

  /** Success url. */
  @Prop() successUrl: string;

  /** Success text for the form. */
  @Prop() successText: {
    title: string;
    description: string;
    button: string;
  };

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
      this.confirmedCheckout = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/checkouts/${checkoutState?.checkout?.id}/confirm`, [expand]),
      })) as Checkout;
      this.scSetState.emit('CONFIRMED');
      // emit the order paid event for tracking scripts.
      this.scOrderPaid.emit(this.confirmedCheckout);
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    } finally {
      // always clear the checkout.
      clearCheckout();
      // get success url.
      const successUrl = this.confirmedCheckout?.metadata?.success_url || this.successUrl;
      if (successUrl) {
        // set state to redirecting.
        this.scSetState.emit('REDIRECT');
        setTimeout(() => window.location.assign(addQueryArgs(successUrl, { order: this.confirmedCheckout?.id })), 50);
      } else {
        this.showSuccessModal = true;
      }
    }
  }

  getSuccessUrl() {
    const url = this.confirmedCheckout?.metadata?.success_url || this.successUrl;
    return url ? addQueryArgs(url, { order: this.confirmedCheckout?.id }) : window?.scData?.pages?.dashboard;
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
            heading={this.successText?.title || __('Thanks for your order!', 'surecart')}
            style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}
          >
            <span slot="description">
              {this.successText?.description || __('Your payment was successful, and your order is complete. A receipt is on its way to your inbox.', 'surecart')}
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
              {this.successText?.button || __('Continue', 'surecart')}
              <sc-icon name="arrow-right" slot="suffix" />
            </sc-button>
          </sc-dashboard-module>
        </sc-dialog>
      </Host>
    );
  }
}
