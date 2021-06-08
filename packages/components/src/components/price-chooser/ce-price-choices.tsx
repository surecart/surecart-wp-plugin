import { Component, State, h, Prop } from '@stencil/core';
import { Price } from '../../types';
import { getFormattedPrice } from '../../functions/price';

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: true,
})
export class CePriceChoices {
  @Prop() priceIds: Array<string>;

  @State() loading: boolean = true;
  @State() prices: Array<Price>;

  componentDidLoad() {
    setTimeout(() => {
      this.prices = [
        {
          id: 'dd514523-297b-4a86-b5ff-6db0a70d7e17',
          name: 'Yearly',
          amount: 9900,
          currency: 'usd',
          recurring: true,
          recurring_interval: 'year',
          recurring_interval_count: 0,
          active: true,
          metadata: {},
          product_id: 'b5eb983f-93fe-429b-afcb-de7d1db2f2e4',
          created_at: '2021-05-26T19:12:53.667Z',
          updated_at: '2021-05-26T19:12:53.667Z',
          product: {
            id: 'b5eb983f-93fe-429b-afcb-de7d1db2f2e4',
            name: 'Updated Product',
            description: 'Updated Product Description',
            active: true,
            metadata: {},
            created_at: '2021-05-26T19:06:34.907Z',
            updated_at: '2021-05-26T19:12:53.670Z',
          },
        },
        {
          id: 'dd514523-297b-4a86-b5ff-6db0a70d7e17',
          name: 'Monthly',
          amount: 999,
          currency: 'usd',
          recurring: true,
          recurring_interval: 'month',
          recurring_interval_count: 2,
          active: true,
          metadata: {},
          product_id: 'b5eb983f-93fe-429b-afcb-de7d1db2f2e4',
          created_at: '2021-05-26T19:12:53.667Z',
          updated_at: '2021-05-26T19:12:53.667Z',
          product: {
            id: 'b5eb983f-93fe-429b-afcb-de7d1db2f2e4',
            name: 'Updated Product',
            description: 'Updated Product Description',
            active: true,
            metadata: {},
            created_at: '2021-05-26T19:06:34.907Z',
            updated_at: '2021-05-26T19:12:53.670Z',
          },
        },
        {
          id: '85109619-529d-47b3-98c3-ca90d22913e4',
          name: 'Lifetime',
          amount: 999900,
          currency: 'usd',
          recurring: false,
          recurring_interval: null,
          recurring_interval_count: null,
          active: true,
          metadata: {},
          product_id: 'b5eb983f-93fe-429b-afcb-de7d1db2f2e4',
          created_at: '2021-06-08T18:54:59.297Z',
          updated_at: '2021-06-08T18:54:59.297Z',
          product: {
            id: 'b5eb983f-93fe-429b-afcb-de7d1db2f2e4',
            name: 'Updated Product',
            description: 'Updated Product Description',
            active: true,
            metadata: {},
            created_at: '2021-05-26T19:06:34.907Z',
            updated_at: '2021-06-08T18:54:59.302Z',
          },
        },
      ];
      this.loading = false;
    }, 1000);
  }

  // TODO: translations needed here - maybe do this in storeedge
  choicePrice(price: Price) {
    const formatted = getFormattedPrice(price);
    return `${formatted} ${price.recurring_interval ? `per ${price.recurring_interval}` : 'once'}`;
  }

  render() {
    if (this.loading) {
      return (
        <ce-choices tabindex="1">
          {this.priceIds.map((_, index) => {
            return (
              <ce-choice name="test" disabled checked={index === 0}>
                <ce-skeleton style={{ width: '25%' }}></ce-skeleton>
                <ce-skeleton style={{ width: '40%' }} slot="description"></ce-skeleton>
              </ce-choice>
            );
          })}
        </ce-choices>
      );
    }

    return (
      <ce-choices tabindex="1">
        {this.prices.map((price, index) => {
          return (
            <ce-choice name={price.product_id} value={price.id} required checked={index === 0}>
              {price.name}
              <span slot="description">{this.choicePrice(price)}</span>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }
}
