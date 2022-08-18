import { Component,Event,EventEmitter, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Checkout, Processor } from '../../../types';

/**
 * This component listens to the order status
 * and confirms the order when payment is successful.
 */
@Component({
  tag: 'sc-processor-provider',
  shadow: true,
})
export class ScProcessorProvider {
  /** The currently selected processor */
  @Prop() processor: string;

  /** A list of available processors */
  @Prop() processors: Processor[] = [];

  /** The current checkout */
  @Prop() checkout: Checkout;

  /** Our filtered processors based on checkout params */
  @State() filteredProcessors: Processor[] = [];

  /** Event to set a processor in the checkout. */
  @Event() scSetProcessor: EventEmitter<string>;

  /** Update the processor if the selected processor is not valid anymore. */
  @Watch('filteredProcessors')
  handleProcessorChange() {
    if(!this.filteredProcessors.some(processor =>  processor?.processor_type === this.processor || (this.processor === 'paypal-card' && processor?.processor_type === 'paypal'))) {
      this.scSetProcessor.emit(this.filteredProcessors?.[0]?.processor_type);
    }
  }

  /** Watch checkout and filter processors based on if reusable payment method is required. */
  @Watch('checkout')
  handleCheckoutChange() {
    this.filteredProcessors = this.processors.filter(processor => {
      return !(this?.checkout?.reusable_payment_method_required && !processor?.recurring_enabled);
    })
  }

  render() {
    return null;
  }
}
