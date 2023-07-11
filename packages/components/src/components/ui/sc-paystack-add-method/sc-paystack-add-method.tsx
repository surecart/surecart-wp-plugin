/**
 * WordPress dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies.
 */
import PaystackPop from '@paystack/inline-js';
import { Component, h, Host, Prop, State, Watch } from '@stencil/core';

/**
 * Internal dependencies.
 */
import apiFetch from '../../../functions/fetch';
import { PaymentIntent } from '../../../types';

@Component({
  tag: 'sc-paystack-add-method',
  styleUrl: 'sc-paystack-add-method.scss',
  shadow: false,
})
export class ScPaystackAddMethod {
  @Prop() liveMode: boolean = true;
  @Prop() customerId: string;
  @Prop() successUrl: string;
  @Prop() currency: string;

  @State() loading: boolean;
  @State() loaded: boolean;
  @State() error: string;
  @State() paymentIntent: PaymentIntent;

  componentWillLoad() {
    this.createPaymentIntent();
  }

  @Watch('paymentIntent')
  async handlePaymentIntentCreate() {
    const { public_key, access_code } = this.paymentIntent?.processor_data?.paystack || {};

    // we need this data.
    if (!public_key || !access_code) return;

    const paystack = new PaystackPop();

    await paystack.newTransaction({
      key: public_key,
      accessCode: access_code, // We'll use accessCode which will handle product, price on our server.
      onSuccess: async transaction => {
        if (transaction?.status !== 'success') {
          throw { message: sprintf(__('Paystack transaction could not be finished. Status: %s', 'surecart'), transaction?.status) };
        }
        window.location.assign(this.successUrl);
      },
      onClose: err => {
        console.error(err);
        alert(err?.message || __('The payment did not process. Please try again.', 'surecart'));
      },
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
          processor_type: 'paystack',
          reusable: true,
          live_mode: this.liveMode,
          customer_id: this.customerId,
          currency: this.currency,
        },
      });
    } catch (e) {
      this.error = e?.additional_errors?.[0]?.message || e?.message || __('Something went wrong', 'surecart');
    } finally {
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
        <div class="sc-paystack-button-container" hidden={!this.loaded}></div>
      </Host>
    );
  }
}
