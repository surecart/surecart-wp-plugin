import { Component, h, Prop, State, Watch } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';
import { PaymentIntent } from '../../../types';

@Component({
  tag: 'sc-stripe-add-method',
  styleUrl: 'sc-stripe-add-method.scss',
  shadow: false,
})
export class ScStripeAddMethod {
  /** Holds the element container. */
  private container: HTMLDivElement;
  // holds the elements instance.
  private elements: any;
  // holds the stripe element.
  private element: any;
  // holds the stripe instance.
  private stripe: Stripe;

  @Prop() liveMode: boolean = true;
  @Prop() customerId: string;
  @Prop() successUrl: string;

  @State() loading: boolean;
  @State() loaded: boolean;
  @State() error: string;
  @State() paymentIntent: PaymentIntent;

  componentWillLoad() {
    this.createPaymentIntent();
  }

  @Watch('paymentIntent')
  async handlePaymentIntentCreate() {
    // we need this data.
    if (!this.paymentIntent?.processor_data?.stripe?.publishable_key || !this.paymentIntent?.processor_data?.stripe?.account_id) return;

    // check if stripe has been initialized
    if (!this.stripe) {
      this.stripe = await loadStripe(this.paymentIntent?.processor_data?.stripe?.publishable_key, { stripeAccount: this.paymentIntent?.processor_data?.stripe?.account_id });
    }

    // load the element.
    // we need a stripe instance and client secret.
    if (!this.paymentIntent?.processor_data?.stripe?.client_secret || !this.container) {
      console.warn('do not have client secret or container');
      return;
    }

    // get the computed styles.
    const styles = getComputedStyle(document.body);

    // we have what we need, load elements.
    this.elements = this.stripe.elements({
      clientSecret: this.paymentIntent?.processor_data?.stripe?.client_secret,
      appearance: {
        variables: {
          colorPrimary: styles.getPropertyValue('--sc-color-primary-500'),
          colorText: styles.getPropertyValue('--sc-input-label-color'),
          borderRadius: styles.getPropertyValue('--sc-input-border-radius-medium'),
          colorBackground: styles.getPropertyValue('--sc-input-background-color'),
          fontSizeBase: styles.getPropertyValue('--sc-input-font-size-medium'),
        },
        rules: {
          '.Input': {
            border: styles.getPropertyValue('--sc-input-border'),
          },
          '.Input::placeholder': {
            color: styles.getPropertyValue('--sc-input-placeholder-color'),
          },
        },
      },
    });

    // create the payment element.
    this.elements
      .create('payment', {
        wallets: {
          applePay: 'never',
          googlePay: 'never',
        },
      })
      .mount('.sc-payment-element-container');
    this.element = this.elements.getElement('payment');
    this.element.on('ready', () => (this.loaded = true));
  }

  async createPaymentIntent() {
    try {
      this.loading = true;
      this.error = '';
      this.paymentIntent = await apiFetch({
        method: 'POST',
        path: 'surecart/v1/payment_intents',
        data: {
          processor_type: 'stripe',
          live_mode: this.liveMode,
          customer_id: this.customerId,
        },
      });
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle form submission.
   */
  async handleSubmit(e) {
    e.preventDefault();
    this.loading = true;
    try {
      const confirmed = await this.stripe.confirmSetup({
        elements: this.elements,
        confirmParams: {
          return_url: this.successUrl,
        },
        redirect: 'always',
      });
      if (confirmed?.error) {
        this.error = confirmed.error.message;
        throw confirmed.error;
      }
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  render() {
    return (
      <sc-form onScFormSubmit={e => this.handleSubmit(e)}>
        {this.error && (
          <sc-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </sc-alert>
        )}
        <div class="loader" hidden={this.loaded}>
          <div class="loader__row">
            <div style={{ width: '50%' }}>
              <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
              <sc-skeleton></sc-skeleton>
            </div>
            <div style={{ flex: '1' }}>
              <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
              <sc-skeleton></sc-skeleton>
            </div>
            <div style={{ flex: '1' }}>
              <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
              <sc-skeleton></sc-skeleton>
            </div>
          </div>
          <div class="loader__details">
            <sc-skeleton style={{ height: '1rem' }}></sc-skeleton>
            <sc-skeleton style={{ height: '1rem', width: '30%' }}></sc-skeleton>
          </div>
        </div>
        <div hidden={!this.loaded} class="sc-payment-element-container" ref={el => (this.container = el as HTMLDivElement)}></div>

        <sc-button type="primary" submit full loading={this.loading}>
          {__('Save Payment Method', 'surecart')}
        </sc-button>
      </sc-form>
    );
  }
}
