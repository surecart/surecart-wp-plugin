import { Component, h, Prop, Element, Watch, Event, EventEmitter, State } from '@stencil/core';
import { Price, LineItemData } from '../../../types';
import { getPrices } from '../../../services/price/index';
import { getFormattedPrice } from '../../../functions/price';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  private _priceIds: Array<string>;
  @Prop() priceIds: Array<string> | string;

  @Prop() default: string;
  @Prop() type: 'radio' | 'checkbox' = 'radio';
  @Prop() columns: number = 1;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() currencyCode: string;

  @State() loading: boolean;
  @State() prices: Array<Price>;

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<Array<LineItemData>>;

  /** Fetch prices event. */
  @Event() ceFetchPrices: EventEmitter<Array<string>>;

  /** Watch price ids and possibly turn string to json. */
  @Watch('priceIds')
  handlePriceIds(val: Array<string> | string) {
    this._priceIds = typeof val === 'string' ? JSON.parse(val) : val;
    this.fetchPrices();
  }

  async fetchPrices() {
    this.loading = true;
    try {
      this.prices = await getPrices({
        query: {
          active: true,
          ids: this.priceIds,
        },
        currencyCode: this.currencyCode,
      });
    } finally {
      this.loading = false;
    }
  }

  /** Parse price ids and maybe fetch. */
  componentWillLoad() {
    if (this.priceIds) {
      this.handlePriceIds(this.priceIds);
    }
  }

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
    if (!this._priceIds?.length) {
      return;
    }

    if (this.loading) {
      return (
        <ce-choices style={{ '--columns': this.columns.toString() }}>
          {this._priceIds.map((id, index) => {
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
      <ce-choices class="loaded" style={{ '--columns': this.columns.toString() }}>
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

openWormhole(CePriceChoices, ['currencyCode'], false);
