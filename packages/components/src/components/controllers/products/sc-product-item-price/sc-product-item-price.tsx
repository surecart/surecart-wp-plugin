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

  /** Show price range? */
  @Prop() range: boolean = true;

  render() {
    const price = (this.prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);
    return (
      <div class="product-price" part="base">
        {!this.range && this.prices?.length ? (
          <sc-format-number type="currency" currency={price?.currency || 'usd'} value={price?.amount}></sc-format-number>
        ) : (
          <sc-price-range prices={this.prices}></sc-price-range>
        )}
      </div>
    );
  }
}
