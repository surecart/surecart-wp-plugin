import { Component, Element, Event, EventEmitter, h, Host, Watch, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { speak } from '@wordpress/a11y';

import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { state as checkoutState } from '@store/checkout';
import { state as formState } from '@store/form';
import { Checkout, ManualPaymentMethod } from '../../../types';
import { createErrorNotice } from '@store/notices/mutations';
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
  private continueButton: HTMLScButtonElement;
  /** The order confirm provider element */
  @Element() el: HTMLScOrderConfirmProviderElement;

  /** Whether to show success modal */
  @State() showSuccessModal: boolean = false;

  /** Whether to show success modal */
  @State() manualPaymentMethod: ManualPaymentMethod;

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
    } else if (this.checkoutStatus === 'confirmed') {
      speak(__('Order has been confirmed. Please select continue to go to the next step.', 'surecart'));
    }
  }

  /** Confirm the order. */
  async confirmOrder() {
    try {
      checkoutState.checkout = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/checkouts/${checkoutState?.checkout?.id}/confirm`, { expand }),
      })) as Checkout;
      this.scSetState.emit('CONFIRMED');
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
    } finally {
      this.manualPaymentMethod = (checkoutState.checkout?.manual_payment_method as ManualPaymentMethod) || null;
      const checkout = checkoutState.checkout;
      const formId = checkoutState.formId;

      // If there is an initial upsell redirect to it.
      if (!!checkout?.current_upsell?.permalink) {
        setTimeout(
          () =>
            window.location.assign(
              addQueryArgs(checkout?.current_upsell?.permalink?.replace(/\/$/, ''), {
                sc_checkout_id: checkout?.id,
                sc_form_id: formId,
              }),
            ),
          50,
        );
        clearCheckout();
        return;
      }

      // get success url.
      const successUrl = checkout?.metadata?.success_url || this.successUrl;
      if (successUrl) {
        // set state to redirecting.
        this.scSetState.emit('REDIRECT');
        const redirectUrl = addQueryArgs(successUrl, { sc_order: checkout?.id });
        setTimeout(() => window.location.assign(redirectUrl), 50);
      } else {
        this.showSuccessModal = true;
      }
      clearCheckout();
    }
  }

  getSuccessUrl() {
    const url = checkoutState.checkout?.metadata?.success_url || this.successUrl;
    return url ? addQueryArgs(url, { sc_order: checkoutState.checkout?.id }) : window?.scData?.pages?.dashboard;
  }

  @Watch('showSuccessModal')
  handleSuccessModal() {
    if (this.showSuccessModal) {
      setTimeout(() => {
        this.continueButton?.focus();
      }, 50);
    }
  }

  render() {
    return (
      <Host>
        <slot />
        <sc-dialog
          open={!!this.showSuccessModal}
          style={{ '--body-spacing': 'var(--sc-spacing-xxx-large)', '--width': '400px' }}
          noHeader
          onScRequestClose={e => e.preventDefault()}
        >
          <div class="confirm__icon">
            <div class="confirm__icon-container">
              <sc-icon name="check" />
            </div>
          </div>
          <sc-dashboard-module
            heading={formState?.text?.success?.title || __('Thanks for your order!', 'surecart')}
            style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}
          >
            <span slot="description">{formState?.text?.success?.description || __('Your payment was successful. A receipt is on its way to your inbox.', 'surecart')}</span>
            {!!this.manualPaymentMethod?.name && !!this.manualPaymentMethod?.instructions && (
              <sc-alert type="info" open style={{ 'text-align': 'left' }}>
                <span slot="title">{this.manualPaymentMethod?.name}</span>
                <div innerHTML={this.manualPaymentMethod?.instructions}></div>
              </sc-alert>
            )}
            <sc-button href={this.getSuccessUrl()} size="large" type="primary" ref={el => (this.continueButton = el as HTMLScButtonElement)}>
              {formState?.text?.success?.button || __('Continue', 'surecart')}
              <sc-icon name="arrow-right" slot="suffix" />
            </sc-button>
          </sc-dashboard-module>
        </sc-dialog>
      </Host>
    );
  }
}
