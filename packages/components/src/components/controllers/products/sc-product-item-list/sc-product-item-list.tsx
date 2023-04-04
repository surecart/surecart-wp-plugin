import { Component, h, Prop, State } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

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
          archived: 0,
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
          'product-item-list-wrapper': true,
        }}
      >
        <div
          class={{
            'product-item-list': true,
          }}
        >
          {this.loading ? (
            [...Array(10)].map(() => (
              <div class="product-item-list__loader">
                {this.layoutConfig?.map(layout => {
                  switch (layout.blockName) {
                    case 'surecart/product-item-title':
                      return <sc-skeleton style={{ width: '80%' }}></sc-skeleton>;
                    case 'surecart/product-item-image':
                      return (
                        <sc-skeleton
                          style={{
                            'width': '100%',
                            'minHeight': '90%',
                            'aspectRatio': layout.attributes?.ratio ?? '1/1.4',
                            '--sc-border-radius-pill': '12px',
                          }}
                        ></sc-skeleton>
                      );
                    case 'surecart/product-item-price':
                      return <sc-skeleton style={{ width: '40%' }}></sc-skeleton>;
                    default:
                      return null;
                  }
                })}
              </div>
            ))
          ) : this.products?.length ? (
            this.products.map(product => {
              return <sc-product-item product={product} layoutConfig={this.layoutConfig}></sc-product-item>;
            })
          ) : (
            <p>{__('No Product Found.', 'surecart')}</p>
          )}
        </div>
      </div>
    );
  }
}
