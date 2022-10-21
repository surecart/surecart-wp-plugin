import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';

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

  /** Show the toggle */
  @Event() scShow: EventEmitter<void>;

  render() {
    const Tag = this.hasOthers ? 'sc-toggle' : 'div';

    return (
      <Tag show-control shady borderless open={this.open} onScShow={() => this.scShow.emit()}>
        {this.hasOthers && <slot name="summary" slot="summary"></slot>}
        <slot />
      </Tag>
    );
  }
}
