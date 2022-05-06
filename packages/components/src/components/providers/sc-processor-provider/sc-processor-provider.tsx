import { Component, h, Listen, Prop } from '@stencil/core';
import { PaymentIntent, ProcessorName } from '../../../types';

@Component({
  tag: 'sc-processor-provider',
  styleUrl: 'sc-processor-provider.css',
  shadow: true,
})
export class ScProcessorProvider {
  @Prop() paymentIntents: { [key: string]: PaymentIntent } = {};
  @Prop() processor: ProcessorName;

  @Listen('scSetPaymentIntent')
  handleSetPaymentIntent(e) {
    const paymentIntent = e.detail?.payment_intent as PaymentIntent;
    const processor = e.detail?.processor;
    this.paymentIntents[processor] = paymentIntent;
  }

  @Listen('scSetProcessor')
  handleProcessorChange(e) {
    this.processor = e.detail;
  }

  render() {
    return <slot></slot>;
  }
}
