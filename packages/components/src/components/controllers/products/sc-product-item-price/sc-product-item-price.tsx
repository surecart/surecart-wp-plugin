import { Component, h, Prop } from '@stencil/core';
import { Price } from 'src/types';

@Component({
  tag: 'sc-product-item-price',
  styleUrl: 'sc-product-item-price.scss',
  shadow: true,
})
export class ScProductItemPrice {
  /* Prices */
  @Prop() prices: Price[];

  render() {
    return (
      <div class={{ 'product-price': true }}>
        <sc-price-range prices={this.prices}></sc-price-range>
      </div>
    );
  }
}
