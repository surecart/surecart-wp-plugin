import { Component, h, Prop } from '@stencil/core';
import { Product } from '../../../types';

@Component({
  tag: 'sc-products',
  styleUrl: 'sc-products.css',
  shadow: true,
})
export class ScProducts {
  @Prop() products: Product[] = [];

  render() {
    console.log('ScProducts', this.products);

    return (
      <div
        class={{
          grid: true,
        }}
      >
        {this.products.length === 0 ? (
          <p>No Products Found!</p>
        ) : (
          this.products.map(product => (
            <div key={product.id}>
              <h3>{product.name}</h3>
            </div>
          ))
        )}
      </div>
    );
  }
}
