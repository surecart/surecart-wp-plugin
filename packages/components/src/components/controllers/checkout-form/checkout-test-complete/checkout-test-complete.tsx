import { Component, Element, Event, EventEmitter, h, Host, Watch, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as processorsState } from '@store/processors';
import { state as selectedProcessorState } from '@store/selected-processor';
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
export class ScCheckoutTestComplete {
  private continueButton: HTMLScButtonElement;
  /** The order confirm provider element */
  @Element() el: HTMLScCheckoutTestCompleteElement;

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
    this.showSuccessModal = true;
    clearCheckout();
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
            heading={__('Test checkout successful!', 'surecart')}
            style={{ '--sc-dashboard-module-spacing': 'var(--sc-spacing-x-large)', 'textAlign': 'center' }}
          >
            <span slot="description">
              {__('This is a simulated test checkout, and no orders were processed. To perform a test order, please contact your store administrator. ', 'surecart')}
            </span>
            {!!this.manualPaymentMethod?.name && !!this.manualPaymentMethod?.instructions && (
              <sc-alert type="info" open style={{ 'text-align': 'left' }}>
                <span slot="title">{this.manualPaymentMethod?.name}</span>
                <div innerHTML={this.manualPaymentMethod?.instructions}></div>
              </sc-alert>
            )}
            <sc-button href={window?.scData?.home_url} size="large" type="primary" ref={el => (this.continueButton = el as HTMLScButtonElement)}>
              {__('Go to Homepage', 'surecart')}
              <sc-icon name="arrow-right" slot="suffix" />
            </sc-button>
          </sc-dashboard-module>
        </sc-dialog>
      </Host>
    );
  }
}
