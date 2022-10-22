import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Checkout } from '../../../types';

@Component({
  tag: 'sc-payment-method-choice',
  styleUrl: 'sc-payment-method-choice.css',
  shadow: true,
})
export class ScPaymentMethodChoice {
  /** Is this open? */
  @Prop() open: boolean;

  /** Does this have others? */
  @Prop() hasOthers: boolean;

  /** The current processor */
  @Prop({ reflect: true }) processor: string;

  /** The processor ID */
  @Prop() processorId: string;

  /** Is this recurring-enabled? */
  @Prop() recurringEnabled: boolean;

  /** The checkout. */
  @Prop() checkout: Checkout;

  @State() isHidden: boolean;

  /** Set the order procesor. */
  @Event() scSetProcessor: EventEmitter<string>;

  @Event() scProcessorInvalid: EventEmitter<void>;

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  @Watch('checkout')
  handleCheckoutChange() {
    this.isHidden = this.checkout?.reusable_payment_method_required && !this.recurringEnabled;
  }

  @Watch('isHidden')
  handleHiddenChange() {
    if (this.isHidden && this.isSelected()) {
      this.scProcessorInvalid.emit();
    }
  }

  isSelected() {
    console.log(this.processor);
    return this.processor === this.processorId;
  }

  render() {
    // do not render if needs recurring and is not supported
    if (this.isHidden) {
      return <Host style={{ display: 'none' }} />;
    }

    const Tag = this.hasOthers ? 'sc-toggle' : 'div';

    return (
      <Tag show-control shady borderless open={this.isSelected()} onScShow={() => this.scSetProcessor.emit(this.processorId)}>
        {this.hasOthers && <slot name="summary" slot="summary"></slot>}
        <slot />
      </Tag>
    );
  }
}

openWormhole(ScPaymentMethodChoice, ['processor', 'checkout'], true);
