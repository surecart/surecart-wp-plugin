import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { Order } from '../../../types';
import { loadScript } from '@paypal/paypal-js';

@Component({
  tag: 'sc-paypal-buttons',
  styleUrl: 'paypal-buttons.scss',
  shadow: true,
})
export class PaypalButtons {
  /** Holds the buttons */
  private container: HTMLDivElement;

  /** Client id for the script. */
  @Prop() clientId: string;

  /** The label. */
  @Prop() label: string;

  /** Test or live mode. */
  @Prop() mode: 'test' | 'live';

  /** The order. */
  @Prop() order: Order;

  @Event() scSetOrderState: EventEmitter<object>;

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

  @Watch('order')
  async confirmPayment(val: Order) {
    console.log(val);
    // must be finalized
    if (val?.status !== 'finalized') return;
    // must be a stripe session
    if (val?.payment_intent?.processor_type !== 'paypal') return;
  }

  componentDidLoad() {
    this.loadScript();
  }

  renderButtons(paypal) {
    const config = {
      onClick: data => {
        // set the funding source when clicked.
        this.scSetOrderState.emit({ fundingSource: data?.fundingSource });
      },
      // Sets up the transaction when a payment button is clicked
      createOrder: (_, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: this?.order?.amount_due || 1, // Can also reference a variable or function
              },
            },
          ],
          application_context: {
            shipping_preference: 'NO_SHIPPING',
          },
        });
      },
      // Finalize the transaction after payer approval
      onApprove: (_, actions) => {
        return actions.order.capture().then(function (orderData) {
          // Successful capture! For dev/demo purposes:
          console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
          const transaction = orderData.purchase_units[0].payments.captures[0];
          alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
          // When ready to go live, remove the alert and show a success message within this page. For example:
          // const element = document.getElementById('paypal-button-container');
          // element.innerHTML = '<h3>Thank you for your payment!</h3>';
          // Or go to another URL:  actions.redirect('thank_you.html');
        });
      },
    };

    if (paypal.FUNDING.PAYPAL) {
      const paypalButton = paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          color: 'silver',
        },
        ...config,
      });
      if (paypalButton.isEligible()) {
        paypalButton.render(this.container);
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
        cardButton.render(this.container);
      }
    }
  }

  render() {
    return (
      <sc-form-control label={this.label}>
        <div class="sc-paypal-button-container" ref={el => (this.container = el as HTMLDivElement)}></div>
      </sc-form-control>
    );
  }
}
