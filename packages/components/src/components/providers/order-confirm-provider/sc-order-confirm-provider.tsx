import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { clearOrder } from '../../../store/checkouts';
import { Checkout, ManualPaymentMethod } from '../../../types';

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

  /** The form id */
  @Prop() formId: number;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The current order. */
  @Prop() order: Checkout;

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
      const confirmed = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/checkouts/${this.order?.id}/confirm`, [expand]),
      })) as Checkout;
      this.scSetState.emit('CONFIRMED');
      // emit the order paid event for tracking scripts.
      this.scOrderPaid.emit(confirmed);
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    } finally {
      // make sure form state changes before redirecting
      setTimeout(() => {
        const successUrl = this?.order?.metadata?.success_url || this.successUrl;
        if(successUrl){
          window.location.assign(addQueryArgs(successUrl, { order:this.order?.id }));
        }
        else{
          this.showSuccessModal = true;
        }

        // make sure we clear the order state no matter what.
        clearOrder(this.formId, this.mode);
      }, 50);
    }
  }

  getSuccessUrl() {
    const url = this?.order?.metadata?.success_url || this.successUrl;
    return url ? addQueryArgs(url, { order: this.order?.id }) : window?.scData?.pages?.dashboard;
  }

  render() {
    const manualPaymentMethod = this.order?.manual_payment_method as ManualPaymentMethod;

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
            <sc-order-manual-instructions manualPaymentTitle={manualPaymentMethod?.name} manualPaymentInstructions={manualPaymentMethod?.instructions} />
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
