import { Component, h, Prop } from '@stencil/core';
import { Creator, Universe } from 'stencil-wormhole';
import { Product } from '../../../../types';

@Component({
  tag: 'sc-product',
  styleUrl: 'sc-product.css',
  shadow: true,
})
export class ScProduct {
  @Prop() product: Product;

  componentWillLoad() {
    Universe.create(this as Creator, this.state());
  }

  state() {
    return {
      product: this.product,
      prices: this.product?.prices?.data || [],
    };
  }

  render() {
    return (
      <div part="base">
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      </div>
    );
  }
}
