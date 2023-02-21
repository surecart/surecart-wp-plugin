import { Component, h, Host, Prop, State } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';

import { Product } from '../../../../types';
import apiFetch from '../../../../functions/fetch';

export type LayoutConfig = {
  blockName: string;
  attributes: any;
}[];

@Component({
  tag: 'sc-product-item-list',
  styleUrl: 'sc-product-item-list.scss',
  shadow: true,
})
export class ScProductItemList {
  /* Product list */
  @State() products: Product[];

  /* Loading indicator */
  @State() loading: boolean = false;

  /* Layout configuration */
  @Prop() layoutConfig: LayoutConfig;

  /* Item styles */
  @Prop() itemStyles: any = {};

  componentWillLoad() {
    this.getProducts();
  }

  // fetch all products
  async getProducts() {
    try {
      this.loading = true;
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/products/`, {
          expand: ['prices'],
        }),
      })) as Product[];
      this.products = response;
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }

  render() {
    console.log(this.layoutConfig);
    return (
      <Host>
        <div
          class={{
            'product-item-list': true,
          }}
        >
          {this.loading ? (
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => (
              <div class="product-item-list__loader">
                <sc-skeleton style={{ width: '80%' }}></sc-skeleton>
                <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
                <sc-skeleton style={{ 'width': '100%', 'minHeight': '90%', 'aspectRatio': '1/1', '--sc-border-radius-pill': '12px' }}></sc-skeleton>
                <sc-skeleton style={{ 'width': '8rem', 'height': '2.5rem', '--sc-border-radius-pill': '12px' }}></sc-skeleton>
              </div>
            ))
          ) : this.products?.length ? (
            this.products.map(product => <sc-product-item product={product} layoutConfig={this.layoutConfig}></sc-product-item>)
          ) : (
            <p>No Product Found.</p>
          )}
        </div>
      </Host>
    );
  }
}
