import { ProcessorName } from '../../../../types';
import { Component, Host, h, Listen, Prop } from '@stencil/core';
import { getProcessorByType } from '@store/processors/getters';
import { formBusy } from '@store/form/getters';

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
    const { processor_data } = getProcessorByType('stripe') || {};

    return <sc-stripe-payment-request debug={this.debug} stripeAccountId={processor_data?.account_id} publishableKey={processor_data?.publishable_key} />;
  }

  render() {
    return (
      <Host class={{ 'is-empty': !this.hasPaymentOptions && !this.debug }}>
        {this.renderStripePaymentRequest()}
        {(this.hasPaymentOptions || this.debug) && <sc-divider style={{ '--spacing': 'calc(var(--sc-form-row-spacing)/2)' }}>{this.dividerText}</sc-divider>}
        {!!formBusy && <sc-block-ui></sc-block-ui>}
      </Host>
    );
  }
}
