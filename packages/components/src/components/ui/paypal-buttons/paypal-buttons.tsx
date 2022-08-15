import { loadScript } from '@paypal/paypal-js';
import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import apiFetch from '../../../functions/fetch';
import { hasSubscription } from '../../../functions/line-items';
import { Checkout, PaymentIntent } from '../../../types';

@Component({
  tag: 'sc-paypal-buttons',
  styleUrl: 'paypal-buttons.scss',
  shadow: true,
})
export class ScPaypalButtons {
  /** This element. */
  @Element() el!: HTMLScPaypalButtonsElement;

  /** Holds the card button */
  private cardContainer: HTMLDivElement;

  /** Holds the paypal buttons */
  private paypalContainer: HTMLDivElement;

  /** Client id for the script. */
  @Prop() clientId: string;

  /** Is this busy? */
  @Prop() busy: boolean = false;

  /** The merchant id for paypal. */
  @Prop() merchantId: string;

  /** Test or live mode. */
  @Prop() mode: 'test' | 'live';

  /** The order. */
  @Prop() order: Checkout;

  /** Buttons to render */
  @Prop() buttons: string[] = ['paypal', 'card'];

  /** Label for the button. */
  @Prop() label: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment' = 'paypal';

  /** Button color. */
  @Prop() color: 'gold' | 'blue' | 'silver' | 'black' | 'white' = 'gold';

  /** Has this loaded? */
  @State() loaded: boolean;

  /** Emit an error */
  @Event() scError: EventEmitter<object>;

  /** Set the state machine */
  @Event() scSetState: EventEmitter<string>;

  @Event() scPaid: EventEmitter<void>;

  @Watch('order')
  handleOrderChange(val, prev) {
    if ( val?.updated_at === prev?.updated_at) {
      return;
    }
    this.cardContainer.innerHTML = '';
    this.paypalContainer.innerHTML = '';
    this.loadScript();
  }

  /** Load the script */
  async loadScript() {
    if (!this.clientId || !this.merchantId) return;
    const subscriptionOrder = hasSubscription(this.order);
    try {
      const paypal = await loadScript({
        'client-id': this.clientId.replace(/ /g, ''),
        ...(!subscriptionOrder ? { 'merchant-id': this.merchantId.replace(/ /g, '') } : {}),
        'commit': false,
        'intent': subscriptionOrder ? 'tokenize' : 'capture',
        'vault': subscriptionOrder,
        'currency': this.order?.currency.toUpperCase() || 'USD',
      });
      this.renderButtons(paypal);
    } catch (err) {
      console.error('failed to load the PayPal JS SDK script', err);
    }
  }

  /** Load the script on component load. */
  componentDidLoad() {
    this.loadScript();
  }

  /** Render the buttons. */
  renderButtons(paypal) {
    const createFunc = hasSubscription(this.order) ? 'createBillingAgreement' : 'createOrder';

    const config = {
      /**
       * Validate the form, client-side when the button is clicked.
       */
      onClick: async (_, actions) => {
        const form = this.el.closest('sc-checkout') as HTMLScCheckoutElement;
        const isValid = await form.validate();
        return isValid ? actions.resolve() : actions.reject();
      },

      onInit: () => {
        this.loaded = true;
      },

      onCancel: () => {
        this.scSetState.emit('REJECT');
      },

      /**
       * The transaction has been approved.
       * We can capture it.
       */
      onApprove: async () => {
        try {
          this.scSetState.emit('PAYING');
          const intent = (await apiFetch({
            method: 'PATCH',
            path: `surecart/v1/payment_intents/${this.order?.payment_intent?.id}/capture`,
          })) as PaymentIntent;
          if (['succeeded', 'pending', 'requires_approval'].includes(intent?.status)) {
            this.scSetState.emit('PAID');
            this.scPaid.emit();
          } else {
            this.scError.emit({ code: 'could_not_capture', message: __('The payment did not process. Please try again.', 'surecart') });
            this.scSetState.emit('REJECT');
          }
        } catch (err) {
          console.error(err);
          this.scError.emit({ code: 'could_not_capture', message: __('The payment did not process. Please try again.', 'surecart') });
          this.scSetState.emit('REJECT');
        }
      },

      /**
       * Transaction errored.
       * @param err
       */
      onError: err => {
        console.error(err);
        this.scError.emit({ code: err?.code, message: err?.message });
        this.scSetState.emit('REJECT');
      },
    };

    config[createFunc] = async () => {
      return new Promise(async (resolve, reject) => {
        // get the checkout component.
        const checkout = this.el.closest('sc-checkout') as HTMLScCheckoutElement;

        // submit and get the finalized order
        const order = (await checkout.submit()) as Checkout;

        // an error occurred. reject with the error.
        if (order instanceof Error) {
          return reject(order);
        }

        // assume there was a validation issue here.
        // that is handled by our fetch function.
        if (order?.status !== 'finalized') {
          return reject(new Error('Something went wrong. Please try again.'));
        }

        // resolve the payment intent id.
        if (order?.payment_intent?.external_intent_id) {
          return resolve(order?.payment_intent?.external_intent_id);
        }

        // we don't have the correct payment intent for some reason.
        this.scError.emit({ code: 'missing_payment_intent', message: __('Something went wrong. Please contact us for payment.', 'surecart') });
        return reject();
      });
    };

    if (paypal.FUNDING.PAYPAL) {
      const paypalButton = paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          label: this.label,
          color: this.color,
        },
        ...config,
      });
      if (paypalButton.isEligible()) {
        paypalButton.render(this.paypalContainer);
      }
    }

    if (paypal.FUNDING.CARD) {
      const cardButton = paypal.Buttons({
        fundingSource: paypal.FUNDING.CARD,
        style: {
          color: 'black',
        },
        ...config,
      });
      if (cardButton.isEligible()) {
        cardButton.render(this.cardContainer);
      }
    }
  }

  render() {
    return (
      <div class={{ 'paypal-buttons': true, 'paypal-buttons--busy': this.busy }}>
        {(!this.loaded || this.busy) && <sc-skeleton style={{ 'height': '55px', '--border-radius': '4px', 'cursor': 'wait' }}></sc-skeleton>}
        <div class="sc-paypal-button-container" hidden={!this.loaded || this.busy}>
          <div hidden={!this.buttons.includes('card')} class="sc-paypal-card-button" ref={el => (this.cardContainer = el as HTMLDivElement)}></div>
          <div hidden={!this.buttons.includes('paypal')} class="sc-paypal-button" ref={el => (this.paypalContainer = el as HTMLDivElement)}></div>
        </div>
      </div>
    );
  }
}
