import { Component, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { Checkout } from '../../../types';
import { openWormhole } from 'stencil-wormhole';
import selectedProcessor from '../../../store/selected-processor';
import { onChange } from '../../../store/processors';

@Component({
  tag: 'sc-payment-method-choice',
  styleUrl: 'sc-payment-method-choice.css',
  shadow: true,
})
export class ScPaymentMethodChoice {
  /** Checkout watcher */
  private checkoutWatcher: Function;

  @Element() el: HTMLScPaymentMethodChoiceElement;

  @Prop({ reflect: true }) methodId: string;

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
  @Event() scSetMethod: EventEmitter<string>;

  /** The currenct processor is invalid. */
  @Event() scProcessorInvalid: EventEmitter<void>;

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  componentWillLoad() {
    this.checkoutWatcher = onChange('availableProcessors', val => {
      this.isDisabled = !(val || []).map(({ processor_type }) => processor_type).includes(this.processorId);
    });
  }

  disconnectedCallback() {
    this.checkoutWatcher();
  }

  isSelected() {
    if (this.methodId) {
      return selectedProcessor?.id === this.processorId && selectedProcessor?.method == this.methodId;
    }
    return selectedProcessor?.id === this.processorId;
  }

  getAllOptions() {
    const parentGroup = this.el.closest('sc-payment') || this.el.parentElement;
    if (!parentGroup) {
      return [];
    }
    return [...parentGroup.querySelectorAll(this.el.tagName)] as HTMLScPaymentMethodChoiceElement[];
  }
  getSiblingItems() {
    return this.getAllOptions().filter(choice => choice !== this.el && !choice.isDisabled) as HTMLScPaymentMethodChoiceElement[];
  }
  hasOthers() {
    return !!this.getSiblingItems()?.length;
  }

  render() {
    // do not render if needs recurring and is not supported
    if (this.isDisabled) {
      return <Host style={{ display: 'none' }} />;
    }

    const Tag = this.hasOthers() ? 'sc-toggle' : 'div';

    return (
      <Tag
        show-control
        shady
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

openWormhole(ScPaymentMethodChoice, ['checkout'], false);
