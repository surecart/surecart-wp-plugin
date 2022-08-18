import { Checkout, ProcessorName } from '../../../../types';
import { Component, Host, h, Listen, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-express-payment',
  styleUrl: 'sc-express-payment.css',
  shadow: false,
})
export class ScExpressPayment {
  @Prop() processor: ProcessorName;
  @Prop() formId: number | string;
  @Prop() busy: boolean;
  @Prop() order: Checkout;
  @Prop() dividerText: string;
  @Prop() debug: boolean;
  @Prop({ mutable: true }) hasPaymentOptions: boolean;

  @Listen('scPaymentRequestLoaded')
  onPaymentRequestLoaded() {
    this.hasPaymentOptions = true;
  }

  renderStripePaymentRequest() {
    if (!this?.order?.processor_data?.stripe?.publishable_key || !this?.order?.processor_data?.stripe?.account_id) {
      return '';
    }

    return (
      <sc-stripe-payment-request
        formId={this.formId}
        debug={this.debug}
        order={this.order}
        stripeAccountId={this?.order?.processor_data?.stripe?.account_id}
        publishableKey={this?.order?.processor_data?.stripe?.publishable_key}
      ></sc-stripe-payment-request>
    );
  }

  render() {
    return (
      <Host class={{ 'is-empty': !this.hasPaymentOptions && !this.debug }}>
        {this.renderStripePaymentRequest()}
        {(this.hasPaymentOptions || this.debug) && <sc-divider style={{ '--spacing': 'calc(var(--sc-form-row-spacing)/2)' }}>{this.dividerText}</sc-divider>}
        {this.busy && <sc-block-ui></sc-block-ui>}
      </Host>
    );
  }
}

openWormhole(ScExpressPayment, ['order', 'formId', 'busy'], false);
