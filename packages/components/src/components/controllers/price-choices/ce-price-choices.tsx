import { Component, h, Prop, Fragment, Element, Listen, Event, EventEmitter } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { LineItemData } from '../../../types';
@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  /** Selector label */
  @Prop() label: string;

  /** Number of columns */
  @Prop() columns: number = 1;

  /** Busy */
  @Prop() busy: boolean = false;

  /** Required by default */
  @Prop() required: boolean = true;

  /** Toggle line item event */
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceUpdateLineItem: EventEmitter<LineItemData>;

  @Listen('ceChange')
  handleChange() {
    this.el.querySelectorAll('ce-price-choice').forEach(priceChoice => {
      // get the underlying control
      const choice = priceChoice.querySelector('ce-choice');
      if (!choice.checked) {
        this.ceRemoveLineItem.emit({ price_id: priceChoice.priceId, quantity: priceChoice.quantity });
      } else {
        this.ceUpdateLineItem.emit({ price_id: priceChoice.priceId, quantity: priceChoice.quantity });
      }
    });
  }

  render() {
    return (
      <Fragment>
        <ce-choices label={this.label} required={this.required} class="loaded price-selector" style={{ '--columns': this.columns.toString() }}>
          <slot />
        </ce-choices>
        {this.busy && <ce-block-ui z-index={4}></ce-block-ui>}
      </Fragment>
    );
  }
}

openWormhole(CePriceChoices, ['busy'], false);
