import { Component, Element, Event, EventEmitter, Fragment, h, Listen, Prop } from '@stencil/core';
import { getLineItemByPriceId } from '../../../../functions/line-items';
import { LineItemData } from '../../../../types';
import { state as checkoutState } from '@store/checkout';

@Component({
  tag: 'sc-price-choices',
  styleUrl: 'sc-price-choices.css',
  shadow: false,
})
export class ScPriceChoices {
  @Element() el: HTMLScPriceChoicesElement;

  /** Selector label */
  @Prop() label: string;

  /** Number of columns */
  @Prop() columns: number = 1;

  /** Required by default */
  @Prop() required: boolean = true;

  /** Toggle line item event */
  @Event() scRemoveLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  @Listen('scChange')
  handleChange() {
    this.el.querySelectorAll('sc-price-choice').forEach(priceChoice => {
      const choice = priceChoice.querySelector('sc-choice') || priceChoice.querySelector('sc-choice-container');
      if (!choice?.checked) {
        this.scRemoveLineItem.emit({ price_id: priceChoice.priceId, quantity: priceChoice.quantity });
      } else {
        const lineItem = getLineItemByPriceId(checkoutState.checkout?.line_items, choice.value);
        this.scUpdateLineItem.emit({ price_id: priceChoice.priceId, quantity: lineItem?.quantity || priceChoice?.quantity || 1 });
      }
    });
  }

  render() {
    return (
      <Fragment>
        <sc-choices label={this.label} required={this.required} class="loaded price-selector" style={{ '--columns': this.columns.toString() }}>
          <slot />
        </sc-choices>
      </Fragment>
    );
  }
}
