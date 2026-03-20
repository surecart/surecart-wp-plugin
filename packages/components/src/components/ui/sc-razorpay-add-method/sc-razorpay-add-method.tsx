/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies.
 */
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

/**
 * Internal dependencies.
 */
import apiFetch from '../../../functions/fetch';
import { loadRazorpay } from 'src/functions/razorpay';
import { PaymentIntent, RazorpayConstructor } from 'src/types';

@Component({
  tag: 'sc-razorpay-add-method',
  styleUrl: 'sc-razorpay-add-method.scss',
  shadow: false,
})
export class ScRazorpayAddMethod {
  @Prop() liveMode: boolean = true;
  @Prop() customerId: string;
  @Prop() successUrl: string;
  @Prop() currency: string;

  @State() loading: boolean;
  @State() loaded: boolean;
  @State() error: string;
  @State() paymentIntent: PaymentIntent;

  private razorpayInstance: RazorpayConstructor | null = null;
  private confirming: boolean = false;

  @Watch('paymentIntent')
  async handlePaymentIntentCreate() {
    // Prevent multiple simultaneous payment attempts
    if (this.confirming) return;

    const { external_intent_id, processor_data } = this.paymentIntent || {};
    const { public_key, customer_id } = (processor_data?.razorpay || {}) as any;

    // we need this data.
    if (!public_key || !external_intent_id) return;

    this.confirming = true;

    try {
      // Load Razorpay if not loaded yet.
      if (!this.razorpayInstance) {
        this.razorpayInstance = await loadRazorpay();
      }

      const options = {
        key: public_key,
        order_id: external_intent_id,
        customer_id,
        recurring: true,
        handler: async (response: any) => {
          if (response?.razorpay_payment_id) {
            window.location.assign(this.successUrl);
          } else {
            this.error = __('Payment verification failed. Please contact support.', 'surecart');
            this.loading = false;
          }
        },
        modal: {
          ondismiss: () => {
            this.loading = false;
          },
        },
      };

      const razorpay = new this.razorpayInstance(options);

      razorpay.on('payment.failed', response => {
        this.error = response?.error?.description || __('Payment failed. Please try again.', 'surecart');
        this.loading = false;
        console.error('payment.failed', response);
      });

      razorpay.open();
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
      console.error(e);
    } finally {
      this.confirming = false;
    }
  }

  async createPaymentIntent() {
    try {
      this.loading = true;
      this.error = '';
      this.paymentIntent = await apiFetch({
        method: 'POST',
        path: 'surecart/v1/payment_intents',
        data: {
          processor_type: 'razorpay',
          reusable: true,
          live_mode: this.liveMode,
          customer_id: this.customerId,
          currency: this.currency,
          refresh_status: true,
        },
      });
    } catch (e) {
      console.error(e);
      this.error = e?.additional_errors?.[0]?.message || e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  render() {
    return (
      <Host>
        {this.error && (
          <sc-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </sc-alert>
        )}
        <div class="sc-razorpay-button-container">
          <sc-alert open={true} type="warning">
            {__(
              'In order to add a new card, we will need to make a small transaction to authenticate it. This is for authentication purposes and will be immediately refunded.',
              'surecart',
            )}
            <div>
              <sc-button loading={this.loading} type="primary" onClick={() => this.createPaymentIntent()} style={{ marginTop: 'var(--sc-spacing-medium)' }}>
                {__('Add New Card', 'surecart')}
              </sc-button>
            </div>
          </sc-alert>
        </div>
      </Host>
    );
  }
}
