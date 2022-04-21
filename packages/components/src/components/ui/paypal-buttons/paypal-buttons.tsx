import { Component, Element, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { Order } from '../../../types';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../functions/fetch';
import { loadScript } from '@paypal/paypal-js';

@Component({
  tag: 'sc-paypal-buttons',
  styleUrl: 'paypal-buttons.scss',
  shadow: true,
})
export class ScPaypalButtons {
  @Element() el!: HTMLScPaypalButtonsElement;
  /** Holds the buttons */
  private container: HTMLDivElement;

  /** Client id for the script. */
  @Prop() clientId: string;

  /** Test or live mode. */
  @Prop() mode: 'test' | 'live';

  /** The order. */
  @Prop() order: Order;

  @Prop() buttons: string[] = ['paypal', 'card'];

  @Prop() label: 'paypal' | 'checkout' | 'buynow' | 'pay' | 'installment' = 'paypal';

  @Prop() color: 'gold' | 'blue' | 'silver' | 'black' | 'white' = 'gold';

  @Event() scSetOrderState: EventEmitter<object>;
  @Event() scError: EventEmitter<object>;

  async loadScript() {
    if (!this.clientId) return;
    try {
      const paypal = await loadScript({
        'client-id': this.clientId.replace(/ /g, ''),
        'commit': false,
        'vault': false,
        'currency': this.order?.currency.toUpperCase() || 'USD',
      });
      this.renderButtons(paypal);
    } catch (err) {
      console.error('failed to load the PayPal JS SDK script', err);
    }
  }

  @Watch('clientId')
  handleClientIdChange() {
    this.loadScript();
  }

  componentDidLoad() {
    this.loadScript();
  }

  renderButtons(paypal) {
    const config = {
      /** Validate the form when the button is clicked. */
      onClick: async (data, actions) => {
        // set the funding source when clicked.
        this.scSetOrderState.emit({ fundingSource: data?.fundingSource });
        // validate the form client-side.
        const form = this.el.closest('sc-form') as HTMLScFormElement;
        const isValid = await form.validate();
        return isValid ? actions.resolve() : actions.reject();
      },

      /**
       * Create the order.
       * This creates a payment intent and attaches it to our order.
       */
      createOrder: async () => {
        return new Promise(async (resolve, reject) => {
          const form = this.el.closest('sc-form') as HTMLScFormElement;
          const checkout = this.el.closest('sc-checkout') as HTMLScCheckoutElement;

          // listen for when the order is finalized.
          checkout.addEventListener(
            'scOrderFinalized',
            (e: any) => {
              // if we have the right payment intent, resolve.
              const payment_intent_id = e?.detail?.payment_intent?.external_intent_id;
              if (payment_intent_id) {
                return resolve(payment_intent_id);
              }
              // we don't have the correct payment intent.
              this.scError.emit({ code: 'missing_payment_intent', message: __('Something went wrong. Please contact us for payment.', 'surecart') });
              return reject();
            },
            { once: true },
          );

          // reject on error.
          checkout.addEventListener(
            'scOrderError',
            (e: any) => {
              reject(e.detail);
            },
            { once: true },
          );

          // submit the form.
          form.submit();
        });
      },

      /**
       * The transaction has been approved.
       * We can capture it.
       */
      onApprove: async () => {
        try {
          return await apiFetch({
            method: 'PATCH',
            path: `surecart/v1/payment_intents/${this.order?.payment_intent?.id}/capture`,
          });
        } catch (err) {
          console.error(err);
          this.scError.emit({ code: 'could_not_capture', message: __('The payment did not process. Something went wrong. Please try again.', 'surecart') });
        }
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
    return <div class="sc-paypal-button-container" ref={el => (this.container = el as HTMLDivElement)}></div>;
  }
}
