import { Component, Element, h, Prop } from '@stencil/core';
import { state as selectedProcessor } from '@store/selected-processor';
@Component({
  tag: 'sc-payment-method-choice',
  styleUrl: 'sc-payment-method-choice.css',
  shadow: true,
})
export class ScPaymentMethodChoice {
  @Element() el: HTMLScPaymentMethodChoiceElement;

  /** The method id */
  @Prop({ reflect: true }) methodId: string;

  /** The processor ID */
  @Prop() processorId: string;

  /** Is this a manual processor */
  @Prop() isManual: boolean;

  /** Should we show this in a card? */
  @Prop() card: boolean;

  isSelected() {
    if (this.methodId) {
      return selectedProcessor?.id === this.processorId && selectedProcessor?.method == this.methodId;
    }
    return !selectedProcessor?.method && selectedProcessor?.id === this.processorId;
  }

  getAllOptions() {
    const parentGroup = this.el.closest('sc-payment') || this.el.parentElement;
    if (!parentGroup) {
      return [];
    }
    return [...parentGroup.querySelectorAll(this.el.tagName)] as HTMLScPaymentMethodChoiceElement[];
  }
  getSiblingItems() {
    return this.getAllOptions().filter(choice => choice !== this.el) as HTMLScPaymentMethodChoiceElement[];
  }
  hasOthers() {
    return !!this.getSiblingItems()?.length;
  }

  render() {
    const Tag = this.hasOthers() ? 'sc-toggle' : 'div';

    return (
      <Tag
        show-control
        borderless
        open={this.isSelected()}
        onScShow={() => {
          selectedProcessor.id = this.processorId;
          selectedProcessor.manual = !!this.isManual;
          selectedProcessor.method = this.methodId;
        }}
      >
        {this.hasOthers() && <slot name="summary" slot="summary"></slot>}
        {this.card && !this.hasOthers() ? (
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
