/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies.
 */
import PaystackPop from '@paystack/inline-js';
import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { fetchCheckout } from '../../../services/session';
import { Checkout } from '../../../types';

@Component({
  tag: 'sc-paystack-buttons',
  styleUrl: 'paystack-buttons.scss',
  shadow: true,
})
export class ScPaystackButtons {
  /** This element. */
  @Element() el: HTMLElement;

  /** Holds the card button */
  private cardContainer: HTMLDivElement;

  /** Holds the paystack buttons */
  private paystackContainer: HTMLDivElement;

  /** Account id of the merchant. */
  @Prop() accountId: string;

  /** Is this busy? */
  @Prop() busy: boolean = false;

  /** The api public key for paystack. */
  @Prop() publicKey: string;

  /** Access code after checkout finialize. */
  @State() accessCode: string;

  /** Test or live mode. */
  @Prop() mode: 'test' | 'live';

  /** The order. */
  @Prop({ mutable: true }) order: Checkout;

  /** Buttons to render */
  @Prop() buttons: string[] = ['paystack', 'card'];

  /** Label for the button. */
  @Prop() label: 'paystack' | 'checkout' | 'buynow' | 'pay' | 'installment' = 'paystack';

  /** Has this loaded? */
  @State() loaded: boolean;

  /** Emit an error */
  @Event() scError: EventEmitter<object>;

  /** Set the state machine */
  @Event() scSetState: EventEmitter<string>;

  @Event() scPaid: EventEmitter<void>;

  @Watch('order')
  handleOrderChange(val, prev) {
    if (val?.updated_at === prev?.updated_at) {
      return;
    }

    this.cardContainer.innerHTML = '';
    this.paystackContainer.innerHTML = '';
    this.processTransaction();
  }

  async processTransaction() {
    // Stop processing if not get the access code, public key
    // and order is not paid yet
    if (!this.publicKey || !this.accessCode || this.order?.status === 'paid') return;

    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        'key': this.publicKey,
        'accessCode': this.accessCode, // We'll use accessCode which will handle product, price on our server.
        onSuccess: async () => {
          try {
            this.order = (await fetchCheckout({
              id: this.order?.id,
              query: {
                refresh_status: true
              },
            })) as Checkout;

            // Start to make the paying.
            this.scSetState.emit('PAYING');

            // If order status is paid, it's actually paid.
            if (this.order?.status === 'paid') {
              this.scSetState.emit('PAID');
              this.scPaid.emit();
            } else {
              this.scError.emit({ code: 'could_not_capture', message: __('The payment did not process. Please try again.', 'surecart') });
              this.scSetState.emit('REJECT');
            }
          } catch (e) {
            console.error(e);
            this.scError.emit({ code: 'could_not_capture', message: __('The payment did not process. Please try again.', 'surecart') });
            this.scSetState.emit('REJECT');
          }
        },
        onCancel: () => {
          this.scError.emit({ code: 'transaction_cancelled', message: __('The payment did not process. Please try again', 'surecart') });
          this.scSetState.emit('REJECT');
        },
      });
    } catch (err) {
      console.error('failed to load the Paystack JS SDK script', err);
    }
  }

  async checkAndConfigure() {
    return new Promise(async (resolve, reject) => {
      const checkout = this.el.closest('sc-checkout') as HTMLScCheckoutElement;

      const isValid = await checkout.validate();
      if (!isValid) {
        return reject(new Error('Something went wrong. Please try again.'));
      }

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
        this.accessCode = order?.payment_intent?.processor_data?.paystack?.access_code;
        return resolve(order?.payment_intent?.external_intent_id);
      }

      // we don't have the correct payment intent for some reason.
      this.scError.emit({ code: 'missing_payment_intent', message: __('Something went wrong. Please contact us for payment.', 'surecart') });
      return reject();
    });
  };

  render() {
    return (
      <div part={`base ${this.busy}`} class={{ 'paystack-buttons': true, 'paystack-buttons--busy': this.busy }}>
        {(this.busy) && <sc-skeleton style={{ 'height': '55px', '--border-radius': '4px', 'cursor': 'wait' }}></sc-skeleton>}
        <div class="sc-paystack-button-container" hidden={this.busy}>
          <div part="paystack-card-button" hidden={!this.buttons.includes('card')} class="sc-paystack-card-button" ref={el => (this.cardContainer = el as HTMLDivElement)}></div>
          <div part="paystack-button" hidden={!this.buttons.includes('paystack')} class="sc-paystack-button" ref={el => (this.paystackContainer = el as HTMLDivElement)}></div>
          <sc-button
            onClick={this.checkAndConfigure}
            submit
            type={'primary'}
            size={'medium'}
            full={true}
            loading={this.busy}
            disabled={this.busy}
          >
            <slot>{__('Purchase', 'surecart')}</slot>
            <span>
              {'\u00A0'}
              <sc-total></sc-total>
            </span>
          </sc-button>
        </div>
      </div>
    );
  }
}
