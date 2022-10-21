import { Component, Element, Event, EventEmitter, Fragment, h, Method, Prop, State, Watch } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { Checkout, FormStateSetter } from '../../../types';

@Component({
  tag: 'sc-stripe-element',
  styleUrl: 'sc-stripe-element.scss',
  shadow: false,
})
export class ScStripeElement {
  @Element() el: HTMLElement;
  private container: HTMLDivElement;
  private stripe: any;
  private elements: any;
  private element: any;

  /** Whether this field is disabled */
  @Prop() disabled: boolean;

  /** The checkout session object for finalizing intents */
  @Prop() order: Checkout;

  /** Your stripe connected account id. */
  @Prop() accountId: string;

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

  @Event() scPaid: EventEmitter<void>;
  @Event() scPayError: EventEmitter<any>;
  /** Set the state */
  @Event() scSetState: EventEmitter<FormStateSetter>;

  @State() error: string;
  @State() confirming: boolean;

  async componentWillLoad() {
    if (!this.publishableKey || !this.accountId) {
      return;
    }

    try {
      this.stripe = await loadStripe(this.publishableKey, { stripeAccount: this.accountId });
      this.elements = this.stripe.elements();
    } catch (e) {
      this.error = e?.message || __('Stripe could not be loaded', 'surecart');
    }
  }

  @Watch('order')
  async confirmPayment(val: Checkout) {
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
      this.scSetState.emit('PAYING');
      let response;
      if (val?.payment_intent?.processor_data?.stripe?.type == 'setup') {
        response = await this.confirmCardSetup(val?.payment_intent?.processor_data?.stripe.client_secret);
      } else {
        response = await this.confirmCardPayment(val?.payment_intent?.processor_data?.stripe?.client_secret);
      }
      if (response?.error) {
        this.error = response.error.message;
        throw response.error;
      }
      this.scSetState.emit('PAID');
      // paid
      this.scPaid.emit();
    } catch (e) {
      this.scPayError.emit(e);
      if (e.message) {
        this.error = e.message;
      }
      this.confirming = false;
    }
  }

  /** Confirm card payment */
  @Method('confirmPayment')
  async confirmCardPayment(secret) {
    return this.stripe.confirmCardPayment(secret, {
      payment_method: {
        card: this.element,
        billing_details: {
          ...(this?.order?.name ? { name: this.order.name } : {}),
          ...(this?.order?.email ? { email: this.order.email } : {}),
        },
      },
    });
  }

  /** Confirm card setup. */
  @Method('confirmSetup')
  async confirmCardSetup(secret) {
    return this.stripe.confirmCardSetup(secret, {
      payment_method: {
        card: this.element,
        billing_details: {
          ...(this?.order?.name ? { name: this.order.name } : {}),
          ...(this?.order?.email ? { email: this.order.email } : {}),
        },
      },
    });
  }

  componentDidLoad() {
    if (!this.elements) {
      return;
    }
    // get the computed styles.
    const styles = getComputedStyle(document.body);

    this.elements
      .create('card', {
        style: {
          base: {
            'color': styles.getPropertyValue('--sc-input-label-color'),
            'fontSize': '16px',
            'iconColor': styles.getPropertyValue('--sc-stripe-icon-color'),
            'fontSmoothing': 'antialiased',
            '::placeholder': {
              color: styles.getPropertyValue('--sc-input-placeholder-color'),
            },
          },
          invalid: {
            'color': styles.getPropertyValue('--sc-color-error-500'),
            ':focus': {
              color: styles.getPropertyValue('--sc-input-label-color'),
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
      <Fragment>
        <sc-input class="sc-stripe" size={this.size} label={this.label} hasFocus={this.hasFocus}>
          <div ref={el => (this.container = el as HTMLDivElement)}></div>
        </sc-input>
        {this.error && (
          <sc-text
            style={{
              'color': 'var(--sc-color-danger-500)',
              '--font-size': 'var(--sc-font-size-small)',
              'marginTop': '0.5em',
            }}
          >
            {this.error}
          </sc-text>
        )}
      </Fragment>
    );
  }
}

openWormhole(ScStripeElement, ['order', 'mode']);
