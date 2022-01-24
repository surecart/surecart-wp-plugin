import { Order } from '../../../types';
import { Component, Prop, Element, State, Watch, h, EventEmitter, Event } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';

@Component({
  tag: 'ce-stripe-element',
  styleUrl: 'ce-stripe-element.scss',
  shadow: false,
})
export class CEStripeElement {
  @Element() el: HTMLElement;
  private container: HTMLDivElement;
  private stripe: any;
  private elements: any;
  private element: any;

  /** Whether this field is disabled */
  @Prop() disabled: boolean;

  /** The checkout session object for finalizing intents */
  @Prop() order: Order;

  /** Your stripe connected account id. */
  @Prop() stripeAccountId: string;

  /** Stripe publishable key */
  @Prop() publishableKey: string;

  /** Mode for the payment */
  @Prop() mode: 'live' | 'test' = 'live';

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's label. Alternatively, you can use the label slot. */
  @Prop() label: string;

  /** The input's help text. Alternatively, you can use the help-text slot. */
  @Prop() secureText: string = '';

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  @Event() cePaid: EventEmitter<void>;
  @Event() cePayError: EventEmitter<any>;

  @State() error: string;
  @State() confirming: boolean;

  async componentWillLoad() {
    if (!this.publishableKey || !this.stripeAccountId) {
      return;
    }
    this.stripe = await loadStripe(this.publishableKey, { stripeAccount: this.stripeAccountId });
    this.elements = this.stripe.elements();
  }

  @Watch('order')
  async confirmPayment(val: Order) {
    // needs to be enabled
    if (this.disabled) return;
    // must be finalized
    if (val?.status !== 'finalized') return;
    // must be a stripe session
    if (val?.payment_intent?.processor_type !== 'stripe') return;
    // must have an external intent id
    if (!val?.payment_intent?.external_intent_id) return;
    // must have a secret
    if (!val?.payment_intent?.processor_data?.stripe?.client_secret) return;
    // need an external_type
    if (!val?.payment_intent?.processor_data?.stripe?.type) return;
    // prevent possible double-charges
    if (this.confirming) return;

    this.confirming = true;
    try {
      let response;
      if (val?.payment_intent?.processor_data?.stripe?.type == 'setup') {
        response = await this.confirmCardSetup(val?.payment_intent?.processor_data?.stripe.client_secret);
      } else {
        response = await this.confirmCardPayment(val?.payment_intent?.processor_data?.stripe?.client_secret);
      }
      if (response?.error) {
        throw response.error;
      }
      // paid
      this.cePaid.emit();
    } catch (e) {
      this.cePayError.emit(e);
      if (e.message) {
        this.error = e.message;
      }
    } finally {
      this.confirming = false;
    }
  }

  /** Confirm card payment */
  async confirmCardPayment(secret) {
    return this.stripe.confirmCardPayment(secret, {
      payment_method: {
        card: this.element,
        billing_details: {
          ...(this.order.name ? { name: this.order?.name } : {}),
          ...(this.order.email ? { email: this.order?.email } : {}),
        },
      },
    });
  }

  /** Confirm card setup. */
  confirmCardSetup(secret) {
    return this.stripe.confirmCardSetup(secret, {
      payment_method: {
        card: this.element,
        billing_details: {
          ...(this.order.name ? { name: this.order?.name } : {}),
          ...(this.order.email ? { email: this.order?.email } : {}),
        },
      },
    });
  }

  componentDidLoad() {
    if (!this.elements) {
      return;
    }
    this.elements
      .create('card', {
        style: {
          base: {
            'color': '#303238',
            'fontSize': '16px',
            'fontSmoothing': 'antialiased',
            '::placeholder': {
              color: '#CFD7DF',
            },
          },
          invalid: {
            'color': '#e5424d',
            ':focus': {
              color: '#303238',
            },
          },
        },
      })
      .mount(this.container);

    this.element = this.elements.getElement('card');

    this.element.on('change', event => (this.error = event?.error?.message ? event.error.message : ''));
    this.element.on('focus', () => (this.hasFocus = true));
    this.element.on('blur', () => (this.hasFocus = false));
  }

  render() {
    return (
      <ce-input error-message={this.error} class="ce-stripe" size={this.size} label={this.label} hasFocus={this.hasFocus}>
        <div ref={el => (this.container = el as HTMLDivElement)}></div>
      </ce-input>
    );
  }
}
