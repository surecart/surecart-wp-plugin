import { Component, h, Prop, State, Watch } from '@stencil/core';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
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
  /** Limit to a set of ids.  */
  @Prop() ids: string[];

  /** Sort */
  @Prop({ mutable: true }) sort: string = 'created_at:desc';

  /** Query to search for */
  @Prop({ mutable: true }) query: string;

  /* Layout configuration */
  @Prop() layoutConfig: LayoutConfig;

  /** Should we paginate? */
  @Prop() paginate: boolean = true;

  /* Pagination alignment */
  @Prop() paginationAlignment: string = 'center';

  /* Limit per page */
  @Prop() limit: number = 15;

  /* Product list */
  @State() products: Product[];

  /* Loading indicator */
  @State() loading: boolean = false;

  /** Busy indicator */
  @State() busy: boolean = false;

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
    const { 'product-page': page } = getQueryArgs(window.location.href) as { 'product-page': string };

    if (page) {
      this.currentPage = parseInt(page);
    } else {
      this.currentPage = 1;
      this.appendParam(1);
    }

    try {
      this.loading = true;
      await this.fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  @Watch('sort')
  async handleSortChange() {
    this.updateProducts();
  }

  async updateProducts() {
    try {
      this.busy = true;
      await this.fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      this.busy = false;
    }
  }

  async fetchProducts() {
    const response = (await apiFetch({
      path: addQueryArgs(`surecart/v1/products/`, {
        expand: ['prices'],
        archived: false,
        status: ['published'],
        per_page: this.limit,
        page: this.currentPage,
        sort: this.sort,
        ...(this.ids?.length ? { ids: this.ids } : {}),
        ...(this.query ? { query: this.query } : {}),
      }),
      parse: false,
    })) as Response;
    this.pagination = {
      total: parseInt(response.headers.get('X-WP-Total')),
      total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
    };
    this.products = (await response.json()) as Product[];
  }

  renderSortName() {
    switch (this.sort) {
      case 'created_at:desc':
        return __('Latest', 'surecart');
      case 'created_at:asc':
        return __('Oldest', 'surecart');
      case 'name:asc':
        return __('Alphabetical, A-Z', 'surecart');
      case 'name:desc':
        return __('Alphabetical, Z-A', 'surecart');
      default:
        return __('Sort', 'surecart');
    }
  }

  render() {
    return (
      <div class={{ 'product-item-list__wrapper': true, 'product-item-list__has-search': !!this.query }}>
        <div class="product-item-list__header">
          <div class="product-item-list__sort">
            <sc-dropdown style={{ '--panel-width': '15rem' }}>
              <sc-button type="text" caret slot="trigger">
                {this.renderSortName()}
              </sc-button>
              <sc-menu>
                <sc-menu-item onClick={() => (this.sort = 'created_at:desc')}>{__('Latest', 'surecart')}</sc-menu-item>
                <sc-menu-item onClick={() => (this.sort = 'created_at:asc')}>{__('Oldest', 'surecart')}</sc-menu-item>
                <sc-menu-item onClick={() => (this.sort = 'name:asc')}>{__('Alphabetical, A-Z', 'surecart')}</sc-menu-item>
                <sc-menu-item onClick={() => (this.sort = 'name:desc')}>{__('Alphabetical, Z-A', 'surecart')}</sc-menu-item>
              </sc-menu>
            </sc-dropdown>
          </div>
          <div class="product-item-list__search">
            <sc-button
              class="clear-button"
              type="text"
              slot="suffix"
              size="small"
              onClick={() => {
                this.query = '';
                this.updateProducts();
              }}
            >
              <sc-icon name="x" slot="prefix" />
              {__('Clear', 'surecart')}
            </sc-button>

            <sc-input type="text" placeholder="Search" size="small" value={this.query} onScInput={e => (this.query = e.target.value)}>
              <sc-button class="search-button" type="link" slot="suffix" size="small" onClick={() => this.updateProducts()}>
                <sc-icon name="search" slot="prefix" />
                {__('Search', 'surecart')}
              </sc-button>
            </sc-input>
          </div>
        </div>

        {!this.products?.length && !this.loading && (
          <sc-empty class="product-item-list__empty" icon="shopping-bag">
            {__('No products found.', 'surecart')}
          </sc-empty>
        )}

        <div class="product-item-list">
          {this.loading
            ? [...Array(10)].map(() => (
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
            : (this.products || []).map(product => {
                return <sc-product-item product={product} layoutConfig={this.layoutConfig}></sc-product-item>;
              })}
        </div>
        {!!this.products?.length && this.pagination.total > this.products.length && (
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
        {this.busy && <sc-block-ui />}
      </div>
    );
  }
}
