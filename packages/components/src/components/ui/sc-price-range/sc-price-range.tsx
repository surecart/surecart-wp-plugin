import { Component, Host, h, Prop, Watch, State } from '@stencil/core';
import { Price } from '../../../types';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-price-range',
  styleUrl: 'sc-price-range.scss',
  shadow: true,
})
export class ScPriceRange {
  /**The array of price objects */
  @Prop() prices: Price[];

  @State() private minPrice: Price;
  @State() private maxPrice: Price;

  @Watch('prices')
  handlePricesChange() {
    let min: Price, max: Price;

    (this.prices || [])
      .filter(p => !p?.archived)
      .forEach(price => {
        if (!max || price.amount > max.amount) {
          max = price;
        }

        if (!min || price.amount < min.amount) {
          min = price;
        }
      });

    this.minPrice = min;
    this.maxPrice = max;
  }

  componentWillLoad() {
    this.handlePricesChange();
  }

  render() {
    if (!this.maxPrice || !this.minPrice) {
      return <Host></Host>;
    }

    return (
      <Host>
        {this.maxPrice.amount == this.minPrice.amount ? (
          <span>
            <sc-format-number type="currency" currency={this.maxPrice.currency} value={this.maxPrice.amount}></sc-format-number>
          </span>
        ) : (
          <span>
            <sc-visually-hidden>{__('Price range from', 'surecart')} </sc-visually-hidden>
            <sc-format-number type="currency" currency={this.minPrice.currency} value={this.minPrice.amount}></sc-format-number>
            <span aria-hidden>{' — '}</span>
            <sc-visually-hidden>{__('to', 'surecart')}</sc-visually-hidden>
            <sc-format-number type="currency" currency={this.maxPrice.currency} value={this.maxPrice.amount}></sc-format-number>
          </span>
        )}
      </Host>
    );
  }
}
