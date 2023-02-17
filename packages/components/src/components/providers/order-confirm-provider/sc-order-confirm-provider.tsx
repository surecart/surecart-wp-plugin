import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../functions/fetch';
import { expand } from '../../../services/session';
import { clearOrder } from '../../../store/checkouts';
import { Checkout } from '../../../types';

/**
 * This component listens to the order status
 * and confirms the order when payment is successful.
 */
@Component({
  tag: 'sc-order-confirm-provider',
  shadow: true,
})
export class ScOrderConfirmProvider {
  /** The order confirm provider element */
  @Element() el: HTMLScOrderConfirmProviderElement;

  /**Whether the success modal is open */
  @State() isSuccessModalOpen: boolean = false;

  /**The current order id */
  @State() orderId: string = '';

  /** The form id */
  @Prop() formId: number;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The current order. */
  @Prop() order: Checkout;

  /** Success url. */
  @Prop() successUrl: string;

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
      const order = this.order?.id;

      if (this?.order?.metadata?.success_url || this.successUrl) {
        this.orderId = order;
      }
      // make sure form state changes before redirecting
      setTimeout(() => {
        // make sure we clear the order state no matter what.
        clearOrder(this.formId, this.mode);
        this.isSuccessModalOpen = true;
      }, 50);
    }
  }

  getSuccessUrl() {
    if (this?.order?.metadata?.success_url || this.successUrl) {
      const success_url = this?.order?.metadata?.success_url || this.successUrl;
      return addQueryArgs(success_url, { order: this.orderId });
    }
  }

  onRedirectClick=()=> {
    window.location.assign(this.getSuccessUrl() || window?.scData?.pages?.dashboard);
  }

  render() {
    return (
      <Host>
        <slot />
        <sc-dialog open={this.isSuccessModalOpen} noHeader onScRequestClose={this.onRedirectClick}>
          <sc-flex flexDirection="column" alignItems="center" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-large)' }}>
            <div>
              <svg width="70px" height="70px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z"
                  style={{ fill: 'var(--sc-color-primary-500)' }}
                />
              </svg>
            </div>
            <sc-text
              style={{
                '--font-weight': 'var(--sc-font-weight-bold)',
                '--font-size': 'var(--sc-font-size-large)',
              }}
            >
              {__('Thanks for your order!', 'surecart')}
            </sc-text>
            <sc-text style={{ '--text-align': 'center' }}>
              {__('Woohoo! Your payment was successful, and your orders is complete. A receipt is on its way to your inbox.', 'surecart')}
            </sc-text>
            <sc-button style={{ width: '60%' }} type="primary" onClick={this.onRedirectClick}>
              {__('Continue', 'surecart')}
            </sc-button>
          </sc-flex>
        </sc-dialog>
      </Host>
    );
  }
}
