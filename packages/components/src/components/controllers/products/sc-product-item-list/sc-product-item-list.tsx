import { Component, h, Prop, State } from '@stencil/core';
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
    return (
      <div
        class={{
          'product-item-list': true,
        }}
      >
        {this.loading ? (
          <p>Loading products...</p>
        ) : this.products?.length ? (
          this.products.map(product => <sc-product-item product={product} layoutConfig={this.layoutConfig}></sc-product-item>)
        ) : (
          <p>No Product Found.</p>
        )}
      </div>
    );
  }
}
