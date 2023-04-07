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

  /* Pagination alignment */
  @Prop() paginationAlignment: string = 'center';

  /* Limit per page */
  @Prop() limit: number = 15;

  /* Current page */
  @State() currentPage: number = 1;

  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };

  componentWillLoad() {
    this.getProducts();
  }

  // Append URL if no 'product-page' found
  appendParam(page: number, push: boolean = false) {
    const newUrl = addQueryArgs(location.href, { 'product-page': page });
    if (push) {
      window.location.replace(newUrl);
      return;
    }
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  // Fetch all products
  async getProducts() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const page = Number(params?.['product-page']);

    if (page && !Number.isNaN(page)) {
      this.currentPage = page;
    } else {
      this.currentPage = 1;
      this.appendParam(1);
    }

    try {
      this.loading = true;
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/products/`, {
          expand: ['prices'],
          archived: 0,
          per_page: this.limit,
          page: this.currentPage,
        }),
        parse: false,
      })) as Response;
      this.pagination = {
        total: parseInt(response.headers.get('X-WP-Total')),
        total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
      };
      this.products = (await response.json()) as Product[];
    } catch (error) {
    } finally {
      this.loading = false;
    }
  }

  render() {
    return (
      <div
        class={{
          'product-item-list__wrapper': true,
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
        {this.products?.length && this.pagination.total > this.products.length && (
          <div
            class={{
              'product-item-list__pagination': true,
              '--is-aligned-left': this.paginationAlignment === 'left',
              '--is-aligned-center': this.paginationAlignment === 'center',
              '--is-aligned-right': this.paginationAlignment === 'right',
            }}
          >
            <sc-pagination
              page={this.currentPage}
              perPage={this.limit}
              total={this.pagination.total}
              totalPages={this.pagination.total_pages}
              totalShowing={this.limit}
              onScNextPage={() => this.appendParam(this.currentPage + 1, true)}
              onScPrevPage={() => this.appendParam(this.currentPage - 1, true)}
            ></sc-pagination>
          </div>
        )}
      </div>
    );
  }
}
