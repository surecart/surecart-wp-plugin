import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Price } from '../../../../types';

@Component({
  tag: 'sc-product-prices',
  styleUrl: 'sc-product-prices.css',
  shadow: true,
})
export class ScProductPrices {
  @Prop() prices: Price[];

  render() {
    return <sc-price-range prices={this.prices} />;
  }
}

openWormhole(ScProductPrices, ['prices'], false);
