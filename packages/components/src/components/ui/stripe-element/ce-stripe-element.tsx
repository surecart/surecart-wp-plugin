import { Component, Prop, Element, Method, State, Watch, h } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-stripe-element',
  styleUrl: 'ce-stripe-element.scss',
  shadow: false,
})
export class CEStripeElement {
  @Element() el: HTMLElement;
  private input: HTMLCeInputElement;
  private container: HTMLDivElement;
  private stripe: any;
  private elements: any;
  private element: any;

  /** The checkout session object for finalizing intents */
  @Prop() checkoutSession: CheckoutSession;

  /** Your stripe connected account id. */
  @Prop() stripeAccountId: string;

  /** Stripe publishable key */
  @Prop() publishableKey: string;

  /** The input's size. */
  @Prop({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';

  /** The input's label. Alternatively, you can use the label slot. */
  @Prop() label: string;

  /** The input's help text. Alternatively, you can use the help-text slot. */
  @Prop() help: string = '';

  /** Should we show the label */
  @Prop() showLabel: boolean = true;

  /** Inputs focus */
  @Prop({ mutable: true, reflect: true }) hasFocus: boolean;

  @State() error: string;
  @State() confirming: boolean;

  async componentWillLoad() {
    if (!this.publishableKey) {
      return;
    }
    this.stripe = await loadStripe(this.publishableKey, { stripeAccount: this.stripeAccountId });
    this.elements = this.stripe.elements();
  }

  @Watch('checkoutSession')
  async confirmCardPayment(val: CheckoutSession) {
    // must be finalized
    if (val?.status !== 'finalized') return;
    // must be a stripe session
    if (val?.processor_intent?.processor_type !== 'stripe') return;
    // must have a secret
    if (!val?.processor_intent?.external_client_secret) return;
    // must have an external intent id
    if (!val?.processor_intent?.external_intent_id) return;
    // prevent possible double-charges
    if (this.confirming) return;

    this.confirming = true;
    try {
      const paid = await this.stripe.confirmCardPayment(val.processor_intent.external_client_secret, {
        payment_method: {
          card: this.element,
          billing_details: {
            ...(this.checkoutSession.name ? { name: this.checkoutSession?.name } : {}),
          },
        },
      });
    } finally {
      this.confirming = false;
    }
  }

  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  // @Method()
  // async reportValidity() {
  //   // empty
  //   if (this.container.classList.contains('StripeElement--empty')) {
  //     this.input.setCustomValidity('You must enter your credit card.');
  //   } else {
  //     this.input.setCustomValidity(!!this.error.length ? this.error : '');
  //   }

  //   return this.input.reportValidity();
  // }

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
      <ce-input ref={el => (this.input = el as HTMLCeInputElement)} class="ce-stripe" size={this.size} label={this.label} help={this.help} hasFocus={this.hasFocus} invalid>
        <div ref={el => (this.container = el as HTMLDivElement)}></div>
      </ce-input>
    );
  }
}
