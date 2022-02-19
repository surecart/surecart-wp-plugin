import { Order } from '../../../types';
import { Component, Fragment, h, Listen, Prop, State } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-express-payment',
  styleUrl: 'ce-express-payment.css',
  shadow: false,
})
export class CeExpressPayment {
  @Prop() processor: 'stripe' | 'paypal';
  @Prop() formId: number | string;
  @Prop() order: Order;
  @Prop() dividerText: string;
  @Prop() debug: boolean;

  @State() hasPaymentOptions: boolean;

  @Listen('cePaymentRequestLoaded')
  onPaymentRequestLoaded() {
    this.hasPaymentOptions = true;
  }

  renderStripePaymentRequest() {
    if (!this?.order?.processor_data?.stripe?.publishable_key || !this?.order?.processor_data?.stripe?.account_id) {
      return '';
    }

    return (
      <ce-stripe-payment-request
        formId={this.formId}
        debug={this.debug}
        order={this.order}
        stripeAccountId={this?.order?.processor_data?.stripe?.account_id}
        publishableKey={this?.order?.processor_data?.stripe?.publishable_key}
      ></ce-stripe-payment-request>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderStripePaymentRequest()}
        {(this.hasPaymentOptions || this.debug) && <ce-divider style={{ '--spacing': 'var(--ce-form-row-spacing' }}>{this.dividerText}</ce-divider>}
      </Fragment>
    );
  }
}

openWormhole(CeExpressPayment, ['order', 'formId'], false);
