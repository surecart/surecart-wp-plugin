import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';

import { Checkout, FormStateSetter, PaymentIntent } from '../../../types';

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

  /** The Payment Intent */
  @Prop() paymentIntent: PaymentIntent;

  /** Order to watch */
  @Prop() order: Checkout;

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
  /** Set the state */
  @Event() scSetState: EventEmitter<FormStateSetter>;

  /** Maybe load the stripe element on load. */
  async componentDidLoad() {
    this.initialize();
  }

  @Watch('paymentIntent')
  handleUpdatedChange(val, prev) {
    this.error = '';

    // client secret changed, reload the element
    if (val?.processor_data?.stripe?.client_secret !== prev?.processor_data?.stripe?.client_secret) {
      return this.initialize();
    }

    // otherwise, fetch element updates.
    this.elements.fetchUpdates();
  }

  async initialize() {
    // we need this data.
    if (!this.paymentIntent?.processor_data?.stripe?.publishable_key || !this.paymentIntent?.processor_data?.stripe?.account_id) return;

    // check if stripe has been initialized
    if (!this.stripe) {
      this.stripe = await loadStripe(this.paymentIntent?.processor_data?.stripe?.publishable_key,
        { stripeAccount: this.paymentIntent?.processor_data?.stripe?.account_id }
      );
    }

    // load the element.
    this.loadElement();
  }

  @Watch('order')
  @Watch('error')
  handleUpdateElement() {
    if (!this.element) return;
    if (this.order?.status !== 'draft') return;
    this.element.update({
      fields: {
        billingDetails: {
          email: 'never',
        }
      }
    });
  }

  /**
   * Watch order status and maybe confirm the order.
   */
  @Watch('order')
  async maybeConfirmOrder(val: Checkout, prev: Checkout) {
    // must be finalized
    if (val?.status !== 'finalized') return;
    // the status didn't change.
    if (prev?.status === 'finalized') return;
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
        return_url: window.location.href,
        payment_method_data: {
          billing_details: {
            email: this.order.email,
          }
        },
      },
      redirect: 'if_required',
      ...args,
    };

    // prevent possible double-charges
    if (this.confirming) return;

    try {
      this.scSetState.emit('PAYING');
      const response = type === 'setup' ? await this.stripe.confirmSetup(confirmArgs as any) : await this.stripe.confirmPayment(confirmArgs as any);
      console.log({response});
      if (response?.error) {
        this.error = response.error.message;
        throw response.error;
      }
      this.scSetState.emit('PAID');
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
    if (!this.stripe || !this.paymentIntent?.processor_data?.stripe?.client_secret || !this.container) {
      console.log('do not have stripe or');
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
        fields: {
          billingDetails: {
            email: 'never'
          }
        }
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
