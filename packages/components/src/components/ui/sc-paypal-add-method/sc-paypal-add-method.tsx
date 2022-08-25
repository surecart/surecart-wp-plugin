import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { loadScript, PayPalNamespace } from '@paypal/paypal-js';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';
import { PaymentIntent } from '../../../types';
import { getScriptLoadParams } from '../paypal-buttons/functions';

@Component({
  tag: 'sc-paypal-add-method',
  styleUrl: 'sc-paypal-add-method.scss',
  shadow: false,
})
export class ScPaypalAddMethod {
  /** Holds the card button */
  private container: HTMLDivElement;
  // holds the stripe instance.
  private paypal: PayPalNamespace;

  @Prop() liveMode: boolean = true;
  @Prop() customerId: string;
  @Prop() successUrl: string;
  @Prop() currency: string;

  @State() loading: boolean;
  @State() loaded: boolean;
  @State() error: string;
  @State() paymentIntent: PaymentIntent;

  componentDidLoad() {
    this.createPaymentIntent();
  }

  @Watch('paymentIntent')
  async handlePaymentIntentCreate() {
    const { external_intent_id } = this.paymentIntent || {};
    const { client_id, account_id, merchant_initiated } = this.paymentIntent?.processor_data?.paypal || {};
    // we need this data.
    if (!client_id || !account_id || !external_intent_id) return;

    // check if stripe has been initialized
    if (!this.paypal) {
      try {
        this.paypal = await loadScript(
          getScriptLoadParams({
            clientId: client_id,
            merchantId: account_id,
            merchantInitiated: merchant_initiated,
            reusable: true,
          }),
        );

        this.paypal
          .Buttons({
            onInit: () => {
              this.loaded = true;
            },
            createBillingAgreement: () => {
              return new Promise(resolve => resolve(external_intent_id));
            },
            onApprove: async () => {
              try {
                this.loading = true;
                const intent = (await apiFetch({
                  method: 'PATCH',
                  path: `surecart/v1/payment_intents/${this.paymentIntent?.id}/capture`,
                })) as PaymentIntent;
                if (['succeeded', 'pending', 'requires_approval'].includes(intent?.status)) {
                  window.location.assign(this.successUrl);
                } else {
                  throw { message: __('The payment did not process. Please try again.', 'surecart') };
                }
              } catch (err) {
                console.error(err);
                this.error = err?.message || __('The payment did not process. Please try again.', 'surecart');
                this.loading = false;
              }
            },
            onError: err => {
              console.error(err);
              alert(err?.message || __('The payment did not process. Please try again.', 'surecart'));
            },
          })
          .render(this.container);
      } catch (err) {
        console.error('Failed to load the PayPal JS SDK script', err);
        this.error = __('Failed to load the PayPal JS SDK script', 'surecart');
      }
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
          processor_type: 'paypal',
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
        <div class="sc-paypal-button-container" hidden={!this.loaded} ref={el => (this.container = el as HTMLDivElement)}></div>
      </Host>
    );
  }
}
