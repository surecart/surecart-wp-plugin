import { Component, Element, Event, EventEmitter, Fragment, h, Prop, State } from '@stencil/core';
import { Order, PaymentIntent } from '../../../types';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';
import { loadScript } from '@paypal/paypal-js';

@Component({
  tag: 'sc-paypal-buttons',
  styleUrl: 'paypal-buttons.scss',
  shadow: true,
})
export class ScPaypalButtons {
  /** This element. */
  @Element() el!: HTMLScPaypalButtonsElement;

  /** Holds the buttons */
  private container: HTMLDivElement;

  /** Client id for the script. */
  @Prop() clientId: string;

  /** The merchant id for paypal. */
  @Prop() merchantId: string;

  /** Test or live mode. */
  @Prop() mode: 'test' | 'live';

  /** The order. */
  @Prop() order: Order;

  /** Buttons to render */
  @Prop() buttons: string[] = ['paypal', 'card'];

  /** Label for the button. */
  @Prop() label: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment' = 'paypal';

  /** Button color. */
  @Prop() color: 'gold' | 'blue' | 'silver' | 'black' | 'white' = 'gold';

  /** Has this loaded? */
  @State() loaded: boolean;

  /** Set the order state */
  @Event() scSetOrderState: EventEmitter<object>;

  /** Emit an error */
  @Event() scError: EventEmitter<object>;

  /** Set the state machine */
  @Event() scSetState: EventEmitter<string>;

  @Event() scPaid: EventEmitter<void>;

  /** Load the script */
  async loadScript() {
    if (!this.clientId || !this.merchantId) return;
    try {
      const paypal = await loadScript({
        'client-id': this.clientId.replace(/ /g, ''),
        'merchant-id': this.merchantId,
        'commit': false,
        'vault': false,
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

      /**
       * Create the order.
       * We finalize the order which generates a payment intent.
       */
      createOrder: async () => {
        return new Promise(async (resolve, reject) => {
          // get the checkout component.
          const checkout = this.el.closest('sc-checkout') as HTMLScCheckoutElement;

          // submit and get the finalized order
          const order = (await checkout.submit()) as Order;

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
      },

      /**
       * The transaction has been approved.
       * We can capture it.
       */
      onApprove: async () => {
        try {
          const intent = (await apiFetch({
            method: 'PATCH',
            path: `surecart/v1/payment_intents/${this.order?.payment_intent?.id}/capture`,
          })) as PaymentIntent;
          if (['succeeded', 'pending'].includes(intent?.status)) {
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
        this.scError.emit({ code: err?.code, message: err?.message });
        this.scSetState.emit('REJECT');
      },
    };

    if (paypal.FUNDING.PAYPAL && this.buttons.includes('paypal')) {
      const paypalButton = paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          label: this.label,
          color: this.color,
        },
        ...config,
      });
      if (paypalButton.isEligible()) {
        paypalButton.render(this.container);
      }
    }

    if (paypal.FUNDING.CARD && this.buttons.includes('card')) {
      const cardButton = paypal.Buttons({
        fundingSource: paypal.FUNDING.CARD,
        style: {
          color: 'black',
        },
        ...config,
      });
      if (cardButton.isEligible()) {
        cardButton.render(this.container);
      }
    }
  }

  render() {
    return (
      <Fragment>
        {!this.loaded && <sc-skeleton style={{ 'height': '55px', '--border-radius': '4px', 'cursor': 'wait' }}></sc-skeleton>}
        <div class="sc-paypal-button-container" ref={el => (this.container = el as HTMLDivElement)} hidden={!this.loaded}></div>
      </Fragment>
    );
  }
}
