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
import { PaymentIntent, RazorpayConstructor } from '../../../types';

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

  @Watch('paymentIntent')
  async handlePaymentIntentCreate() {
    const razorpayData = this.paymentIntent?.processor_data?.razorpay || {};
    const { public_key, order_id, customer_id } = razorpayData as any;

    // we need this data.
    if (!public_key || !order_id) return;

    try {
      // Load Razorpay if not loaded yet.
      if (!this.razorpayInstance) {
        await this.loadRazorpay();
      }

      if (!this.razorpayInstance) {
        throw new Error(__('Razorpay script failed to load. Please try again.', 'surecart'));
      }

      const options = {
        key: public_key,
        order_id: order_id,
        customer_id,
        recurring: true,
        handler: async (response: any) => {
          if (response?.razorpay_payment_id) {
            window.location.assign(this.successUrl);
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
    }
  }

  async loadRazorpay(): Promise<void> {
    if (this.razorpayInstance) {
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        this.razorpayInstance = (window as any).Razorpay;
        resolve();
      };
      script.onerror = () => {
        reject(new Error(__('Failed to load Razorpay script.', 'surecart')));
      };
      document.head.appendChild(script);
    });
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
