import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';

import { Invoice, Order } from '../../../types';

@Component({
  tag: 'sc-stripe-payment-element',
  styleUrl: 'sc-stripe-payment-element.scss',
  shadow: false,
})
export class ScStripePaymentElement {
  @Element() el: HTMLScStripePaymentElementElement;
  /** Holds the element container. */
  private container: HTMLDivElement;
  // holds the elements instance.
  private elements: any;
  // holds the stripe element.
  private element: any;
  // holds the stripe instance.
  private stripe: Stripe;

  /** The client secret to render the payment element */
  @Prop() clientSecret: string;

  /** The stripe publishable key. */
  @Prop() publishableKey: string;

  /** The account id. */
  @Prop() accountId: string;

  /** Order to watch */
  @Prop() order: Order | Invoice;

  /** Should we collect an address? */
  @Prop() address: boolean;

  /** Success url to redirect. */
  @Prop() successUrl: string;

  /** The error. */
  @State() error: string;

  /** Is this yet loaded. */
  @State() loaded: boolean = false;

  /** Are we confirming the order? */
  @State() confirming: boolean = false;

  /** The order/invoice was paid for. */
  @Event() scPaid: EventEmitter<void>;

  /** There was a payment error. */
  @Event() scPayError: EventEmitter<any>;

  /** Maybe load the stripe element on load. */
  async componentDidLoad() {
    if (!this.publishableKey || !this.accountId) return;
    this.stripe = await loadStripe(this.publishableKey, { stripeAccount: this.accountId });
    this.loadElement();
  }

  /** Reload element if client secret changes. */
  @Watch('clientSecret')
  handleClientSecretChange(val, prev) {
    if (val !== prev) {
      this.loaded = false;
      this.loadElement();
    }
  }

  /**
   * Watch order status and maybe confirm the order.
   */
  @Watch('order')
  async maybeConfirmOrder(val) {
    // must be finalized
    if (val?.status !== 'finalized') return;
    // must be a stripe session
    if (val?.payment_intent?.processor_type !== 'stripe') return;
    // need an external_type
    if (!val?.payment_intent?.processor_data?.stripe?.type) return;
    // confirm the intent.
    return await this.confirm(val?.payment_intent?.processor_data?.stripe?.type);
  }

  @Method()
  async confirm(type, args = {}) {
    const confirmArgs = {
      elements: this.elements,
      confirmParams: {
        return_url: this.successUrl,
      },
      redirect: 'if_required',
      ...args,
    };

    // prevent possible double-charges
    if (this.confirming) return;
    try {
      const response = type === 'setup' ? await this.stripe.confirmSetup(confirmArgs as any) : await this.stripe.confirmPayment(confirmArgs as any);
      if (response?.error) {
        this.error = response.error.message;
        throw response.error;
      }
      // paid
      this.scPaid.emit();
    } catch (e) {
      console.error(e);
      this.scPayError.emit(e);
      if (e.message) {
        this.error = e.message;
      }
    } finally {
      this.confirming = false;
    }
  }

  loadElement() {
    // we need a stripe instance and client secret.
    if (!this.stripe || !this.clientSecret || !this.container) {
      return;
    }

    // get the computed styles.
    const styles = getComputedStyle(document.body);

    // we have what we need, load elements.
    this.elements = this.stripe.elements({
      clientSecret: this.clientSecret,
      appearance: {
        variables: {
          colorPrimary: styles.getPropertyValue('--sc-color-primary-500'),
          colorText: styles.getPropertyValue('--sc-input-label-color'),
          borderRadius: styles.getPropertyValue('--sc-input-border-radius-medium'),
          colorBackground: styles.getPropertyValue('--sc-input-background-color'),
          fontSizeBase: '16px',
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

  render() {
    return (
      <div class="sc-stripe-payment-element" data-testid="stripe-payment-element">
        {!!this.error && (
          <sc-text
            style={{
              'color': 'var(--sc-color-danger-500)',
              '--font-size': 'var(--sc-font-size-small)',
              'marginBottom': '0.5em',
            }}
          >
            {this.error}
          </sc-text>
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
      </div>
    );
  }
}
