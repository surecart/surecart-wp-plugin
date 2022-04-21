import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';

@Component({
  tag: 'sc-stripe-payment-element',
  styleUrl: 'sc-stripe-payment-element.css',
  shadow: false,
})
export class StripePaymentElement {
  private container: HTMLDivElement;
  private elements: any;
  private element: any;

  /** The client secret to render the payment element */
  @Prop() clientSecret: string;

  /** Stripe instance. */
  @Prop() stripe: Stripe;

  /** A name to send to the element. */
  @Prop() name: string;

  /** When the payment element is ready. */
  @Event() scStripeElementReady: EventEmitter<void>;

  /** Maybe load the stripe element on load. */
  async componentDidLoad() {
    this.loadElement();
  }

  loadElement() {
    if (!this.stripe || !this.clientSecret) {
      return;
    }

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
        },
      },
    });

    // create the payment element.
    this.elements
      .create('payment', {
        fields: {
          // we are collecting this in the form, directly if needed.
          billingDetails: {
            name: 'never',
            email: 'never',
            phone: 'never',
            address: 'never',
          },
        },
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

    this.element = this.elements.getElement('payment');
    this.element.on('ready', () => this.scStripeElementReady.emit());
  }

  render() {
    return <div ref={el => (this.container = el as HTMLDivElement)}></div>;
  }
}
