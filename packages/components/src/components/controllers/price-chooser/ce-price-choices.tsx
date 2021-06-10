import { Component, h, Prop } from '@stencil/core';
import { Price } from '../../../types';
import { getFormattedPrice } from '../../../functions/price';
import { createContext } from '../../context/utils/createContext';
const { Consumer } = createContext({});

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Prop() loading: boolean = true;
  @Prop() submitting: boolean = true;
  @Prop() prices: Array<Price>;
  @Prop() price_ids: Array<string>;
  @Prop() default: string;
  @Prop() type: 'radio' | 'checkbox' = 'radio';
  @Prop() columns: number = 1;

  // TODO: translations needed here - do this in provider
  choicePrice(price: Price) {
    const formatted = getFormattedPrice(price);
    return `${formatted} ${price.recurring_interval ? `per ${price.recurring_interval}` : 'once'}`;
  }

  renderHTML = ({ price_ids, loading, prices }) => {
    if (!price_ids?.length) {
      return;
    }

    if (loading) {
      return (
        <ce-choices style={{ '--columns': this.columns.toString() }}>
          {price_ids.map((id, index) => {
            return (
              <ce-choice name="test" disabled type={this.type} checked={this.default ? this.default === id : index === 0}>
                <ce-skeleton style={{ width: '25%' }}></ce-skeleton>
                <ce-skeleton style={{ width: '40%' }} slot="description"></ce-skeleton>
              </ce-choice>
            );
          })}
        </ce-choices>
      );
    }

    if (!prices?.length) {
      return;
    }

    return (
      <ce-choices style={{ '--columns': this.columns.toString() }}>
        {prices.map((price, index) => {
          return (
            <ce-choice name={price.product_id} value={price.id} type={this.type} checked={this.default ? this.default === price.id : index === 0}>
              {price.name}
              <span slot="description">{this.choicePrice(price)}</span>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  };

  render() {
    return <Consumer>{this.renderHTML}</Consumer>;
  }
}
