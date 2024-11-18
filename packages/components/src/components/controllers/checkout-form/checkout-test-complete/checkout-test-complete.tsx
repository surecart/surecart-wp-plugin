import { Component, Element, Event, EventEmitter, h, Host, Watch, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { state as processorsState } from '@store/processors';
import { state as selectedProcessorState } from '@store/selected-processor';
import { state as checkoutState } from '@store/checkout';
import { state as formState } from '@store/form';
import { Checkout, ManualPaymentMethod } from '../../../../types';
import { clearCheckout } from '@store/checkout/mutations';
/**
 * This component listens to the order status
 * and confirms the order when payment is successful.
 */
@Component({
  tag: 'sc-checkout-test-complete',
  styleUrl: 'checkout-test-complete.scss',
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
    if (this.checkoutStatus === 'test_mode_restricted') {
      this.confirmOrder();
    }
  }

  /** Confirm the order. */
  async confirmOrder() {
    this.manualPaymentMethod = (processorsState.manualPaymentMethods || [])?.find(p => p.id === selectedProcessorState.id);
    const checkout = checkoutState.checkout;

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
        <sc-dialog open={!!this.showSuccessModal} style={{ '--body-spacing': 'var(--sc-spacing-xxx-large)' }} noHeader onScRequestClose={e => e.preventDefault()}>
          <div class="confirm__icon">
            <div class="confirm__icon-container">
              <sc-icon name="check" />
            </div>
          </div>
          <sc-dashboard-module
            heading={__('Test checkout successful!', 'surecart')}
            style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}
          >
            <span slot="description">
              {__(
                'This is a simulated test checkout, so no orders were processed. If you would like to process an real test order, please contact the store administrator.',
                'surecart',
              )}
            </span>
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
