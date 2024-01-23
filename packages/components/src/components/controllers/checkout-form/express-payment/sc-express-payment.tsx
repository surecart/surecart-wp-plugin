import { ProcessorName } from '../../../../types';
import { Component, Host, h, Listen, Prop } from '@stencil/core';
import { getStripeProcessorData } from '@store/processors/getters';
import { state as checkoutState } from '@store/checkout';

@Component({
  tag: 'sc-express-payment',
  styleUrl: 'sc-express-payment.css',
  shadow: false,
})
export class ScExpressPayment {
  @Prop() processor: ProcessorName;
  @Prop() dividerText: string;
  @Prop() debug: boolean;
  @Prop({ mutable: true }) hasPaymentOptions: boolean;

  @Listen('scPaymentRequestLoaded')
  onPaymentRequestLoaded() {
    this.hasPaymentOptions = true;
  }

  renderStripePaymentRequest() {
    const processorData = getStripeProcessorData();
    if (!processorData) {
      return;
    }

    return <sc-stripe-payment-request debug={this.debug} stripeAccountId={processorData.accountId} publishableKey={processorData.publishableKey}></sc-stripe-payment-request>;
  }

  render() {
    return (
      <Host class={{ 'is-empty': !this.hasPaymentOptions && !this.debug }}>
        {this.renderStripePaymentRequest()}
        {(this.hasPaymentOptions || this.debug) && <sc-divider style={{ '--spacing': 'calc(var(--sc-form-row-spacing)/2)' }}>{this.dividerText}</sc-divider>}
        {checkoutState.busy && <sc-block-ui></sc-block-ui>}
      </Host>
    );
  }
}
