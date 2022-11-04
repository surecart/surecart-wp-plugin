import { Component, Event, EventEmitter, h, Host, Prop, Watch } from '@stencil/core';
import { Checkout } from '../../../types';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-payment-method-choice',
  styleUrl: 'sc-payment-method-choice.css',
  shadow: true,
})
export class ScPaymentMethodChoice {
  /** Does this have others? */
  @Prop() hasOthers: boolean;

  /** The current processor */
  @Prop({ reflect: true }) processor: string;

  /** The processor ID */
  @Prop() processorId: string;

  /** Is this a manual processor */
  @Prop() isManual: boolean;

  /** Is this recurring-enabled? */
  @Prop() recurringEnabled: boolean;

  /** The checkout. */
  @Prop() checkout: Checkout;

  /** Is this disabled? */
  @Prop({ reflect: true }) isDisabled: boolean;

  /** Should we show this in a card? */
  @Prop() card: boolean;

  /** Set the order procesor. */
  @Event() scSetProcessor: EventEmitter<{ id: string; manual: boolean }>;

  /** The currenct processor is invalid. */
  @Event() scProcessorInvalid: EventEmitter<void>;

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  @Watch('checkout')
  handleCheckoutChange() {
    this.isDisabled = this.checkout?.reusable_payment_method_required && !this.recurringEnabled;
  }

  @Watch('isDisabled')
  handleHiddenChange() {
    if (this.isDisabled && this.isSelected()) {
      this.scProcessorInvalid.emit();
    }
  }

  isSelected() {
    return this.processor === this.processorId;
  }

  render() {
    // do not render if needs recurring and is not supported
    if (this.isDisabled) {
      return <Host style={{ display: 'none' }} />;
    }

    const Tag = this.hasOthers ? 'sc-toggle' : 'div';

    return (
      <Tag show-control shady borderless open={this.isSelected()} onScShow={() => this.scSetProcessor.emit({ id: this.processorId, manual: !!this.isManual })}>
        {this.hasOthers && <slot name="summary" slot="summary"></slot>}
        {this.card ? (
          <sc-card>
            <slot />
          </sc-card>
        ) : (
          <slot />
        )}
      </Tag>
    );
  }
}

openWormhole(ScPaymentMethodChoice, ['processor', 'checkout'], false);
