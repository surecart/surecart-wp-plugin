import { Component, h, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { Price, LineItemData } from '../../../types';
import { getFormattedPrice } from '../../../functions/price';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  @Prop() loading: boolean = false;
  @Prop() prices: Array<Price>;
  @Prop() priceIds: Array<string>;
  @Prop() default: string;
  @Prop() type: 'radio' | 'checkbox' = 'radio';
  @Prop() columns: number = 1;
  @Prop() lineItemData: Array<LineItemData>;

  @Event() ceUpdateLineItems: EventEmitter<Array<LineItemData>>;

  updateSelected() {
    const choices = this.el.querySelectorAll('ce-choice');

    // get selected choices
    const selected = Array.from(choices).filter(choice => {
      return choice.name && choice.checked && !choice.disabled;
    });

    // convert to line item data
    const data = (selected || []).map(item => {
      return { price_id: item.value, quantity: 1 } as LineItemData;
    });

    // emit update event
    this.ceUpdateLineItems.emit(data);
  }

  render() {
    if (!this.priceIds?.length) {
      return;
    }

    if (this.loading) {
      // TODO: translations needed here - do this in provider
      return (
        <ce-choices style={{ '--columns': this.columns.toString() }}>
          {this.priceIds.map((id, index) => {
            return (
              <ce-choice name="loading" disabled type={this.type} checked={this.default ? this.default === id : index === 0}>
                <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
                <ce-skeleton style={{ width: '140px', display: 'inline-block' }} slot="description"></ce-skeleton>
                <ce-skeleton style={{ width: '20px', display: 'inline-block' }} slot="price"></ce-skeleton>
                <ce-skeleton style={{ width: '40px', display: 'inline-block' }} slot="per"></ce-skeleton>
              </ce-choice>
            );
          })}
        </ce-choices>
      );
    }

    if (!this.prices?.length) {
      return;
    }

    return (
      <ce-choices style={{ '--columns': this.columns.toString() }}>
        {this.prices.map((price, index) => {
          const isDefault = this.prices.find(price => price.id === this.default)?.id;
          return (
            <ce-choice
              class="loaded"
              onCeChange={() => setTimeout(() => this.updateSelected(), 500)}
              name={'price'}
              value={price.id}
              type={this.type}
              checked={isDefault ? true : index === 0}
            >
              {price.name}
              <span slot="description">{price.description}</span>
              <span slot="price">{getFormattedPrice({ amount: price.amount, currency: price.currency })}</span>
              <span slot="per">{price.recurring_interval ? `/ ${price.recurring_interval}` : `once`}</span>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }
}

openWormhole(CePriceChoices, ['prices', 'priceIds', 'loading', 'lineItemData'], false);
