import { Component, h, Prop, Element, Watch, Event, EventEmitter } from '@stencil/core';
import { Price } from '../../../types';
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
  @Prop() selectedPriceIds: Array<string>;

  @Event() cePriceChange: EventEmitter<Array<string>>;

  @Watch('loading')
  handleLoadingChange() {
    if (!this.loading) {
      setTimeout(() => this.updateSelected(), 1);
    }
  }

  updateSelected() {
    const choices = this.el.querySelectorAll('ce-choice');
    const selected = Array.from(choices).filter(choice => {
      return choice.name && choice.checked && !choice.disabled;
    });
    let ids = (selected || []).map(item => item.value);
    this.cePriceChange.emit(ids);
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
            <ce-choice class="loaded" onCeChange={() => this.updateSelected()} name={'price'} value={price.id} type={this.type} checked={isDefault ? true : index === 0}>
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

openWormhole(CePriceChoices, ['prices', 'priceIds', 'loading', 'selectedPriceIds'], false);
