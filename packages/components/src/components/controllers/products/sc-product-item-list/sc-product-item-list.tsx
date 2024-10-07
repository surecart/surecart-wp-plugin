/**
 * External dependencies.
 */
import { Component, Element, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { __, sprintf } from '@wordpress/i18n';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies.
 */
import { Collection, Product, ProductsSearchedParams, ProductsViewedParams } from '../../../../types';
import apiFetch, { handleNonceError } from '../../../../functions/fetch';
import '@store/product/facebook';
import '@store/product/google';

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
  @Element() el: HTMLScProductItemListElement;
  /** Limit to a set of ids.  */
  @Prop() ids: string[];

  /** Sort */
  @Prop({ mutable: true }) sort: string = 'created_at:desc';

  /** Query to search for */
  @Prop({ mutable: true }) query: string;

  /** Should allow search */
  @Prop() searchEnabled: boolean = true;

  /** Should allow search */
  @Prop() sortEnabled: boolean = true;

  /** Should allow collection filter */
  @Prop() collectionEnabled: boolean = true;

  /** Show for a specific collection */
  @Prop() collectionId: string;

  /** The page title */
  @Prop() pageTitle: string;

  /** Show only featured products. */
  @Prop() featured: boolean = false;

  /** Should we paginate? */
  @Prop() paginationEnabled: boolean = true;

  /** Should we paginate? */
  @Prop() ajaxPagination: boolean = true;

  /** Should we auto-scroll to the top when paginating via ajax */
  @Prop() paginationAutoScroll: boolean = true;

  /* Layout configuration */
  @Prop() layoutConfig: LayoutConfig;

  /* Pagination alignment */
  @Prop() paginationAlignment: string = 'center';

  /* Limit per page */
  @Prop() limit: number = 15;

  /* Current page */
  @Prop({ mutable: true }) page: number = 1;

  /* Product list */
  @Prop({ mutable: true }) products?: Product[];

  /* Loading indicator */
  @State() loading: boolean = false;

  /** Busy indicator */
  @State() busy: boolean = false;

  /** Error notice. */
  @State() error: string;

  /** Product was searched */
  @Event() scSearched: EventEmitter<ProductsSearchedParams>;

  /** Products viewed */
  @Event() scProductsViewed: EventEmitter<ProductsViewedParams>;

  /** Current page */
  @State() currentPage = 1;

  /** Current query */
  @State() currentQuery: string;

  /** Pagination */
  @Prop({ mutable: true }) pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };

  /** Collections */
  @State() collections: Collection[];

  /** Selected collections */
  @State() selectedCollections: Collection[] = [];

  @Watch('products')
  handleProductsChanged(newProducts?: Product[], oldProducts?: Product[]) {
    const productIds = new Set([...(oldProducts || []).map(product => product.id), ...(newProducts || []).map(product => product.id)]);

    if (newProducts?.length === oldProducts?.length && productIds.size === newProducts.length) {
      return;
    }

    const title = [
      this.pageTitle,
      this.paginationEnabled ? sprintf(__('Page %d', 'surecart'), this.currentPage) : undefined,
      this.sort ? this.renderSortName() : undefined,
      this.query || this.selectedCollections?.length ? __('Search results', 'surecart') : undefined,
    ]
      .filter(item => !!item)
      .join(' - ');

    this.scProductsViewed.emit({
      products: this.products,
      pageTitle: title,
      collectionId: this.collectionId,
    });
  }

  componentWillLoad() {
    if (!this?.products?.length) {
      this.getProducts();
    } else {
      this.handleProductsChanged(this.products);
    }

    if (this.collectionEnabled) {
      this.getCollections();
    }
  }

  // Append URL if no 'product-page' found
  doPagination(page: number) {
    // handle ajax pagination
    if (this.ajaxPagination) {
      this.page = page;
      this.updateProducts();
      this.paginationAutoScroll && this.el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // handle server pagination.
    const newUrl = addQueryArgs(location.href, { 'product-page': page });
    window.location.replace(newUrl);
  }

  // Fetch all products
  async getProducts() {
    const { 'product-page': page } = getQueryArgs(window.location.href) as {
      'product-page': string;
    };

    this.page = this.paginationEnabled && page ? parseInt(page) : 1;

    try {
      this.loading = true;
      await this.fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  // Fetch all collections
  async getCollections() {
    try {
      this.collections = (await apiFetch({
        path: addQueryArgs('surecart/v1/product_collections/', {
          per_page: 100,
        }),
      })) as Collection[];
    } catch (error) {
      console.error(error);
    }
  }

  @Watch('sort')
  @Watch('selectedCollections')
  @Watch('query')
  async handleSortChange() {
    this.page = 1;
    this.updateProducts();
  }

  async updateProducts(emitSearchEvent: boolean = false) {
    try {
      this.busy = true;
      await this.fetchProducts();
      if (!!this.query && emitSearchEvent) {
        this.scSearched.emit({
          searchString: this.query,
          searchResultCount: this.products?.length,
          searchResultIds: this.products.map(product => product.id),
        });
      }
    } catch (error) {
      console.log('error');
      console.error(error);
      this.error = error.message || __('An unknown error occurred.', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  private debounce;
  @Watch('ids')
  @Watch('limit')
  @Watch('featured')
  handleIdsChange() {
    if (this.debounce !== null) {
      clearTimeout(this.debounce);
      this.debounce = null;
    }

    this.debounce = window.setTimeout(() => {
      // your debounced traitment
      this.updateProducts();
      this.debounce = null;
    }, 200);
  }

  async fetchProducts() {
    let collectionIds = this.selectedCollections?.map(collection => collection.id) || [];

    // If we have a collectionId, we should only fetch products from that collection.
    if (this.collectionId) {
      collectionIds = [this.collectionId];
    }

    try {
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/products/`, {
          expand: ['prices', 'featured_product_media', 'product_medias', 'product_media.media', 'variants'],
          archived: false,
          status: ['published'],
          per_page: this.limit,
          page: this.page,
          sort: this.sort,
          product_collection_ids: collectionIds,
          ...(this.featured ? { featured: true } : {}),
          ...(this.ids?.length ? { ids: this.ids } : {}),
          ...(this.query ? { query: this.query } : {}),
        }),
        parse: false,
      })) as Response;
      this.currentQuery = this.query;
      this.pagination = {
        total: parseInt(response.headers.get('X-WP-Total')),
        total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
      };
      this.products = (await response.json()) as Product[];
      if (!!collectionIds.length || !!this.query) {
        speak(sprintf(__('%s products found', 'surecart'), this.pagination.total));
      }
    } catch (response) {
      // we will want to handle nonce error if we are bypassing the apiFetch parser.
      await handleNonceError(response)
        .then(() => this.fetchProducts())
        .catch(error => {
          this.error = error.message || __('An unknown error occurred.', 'surecart');
        });
    }
  }

  renderSortName() {
    switch (this.sort) {
      case 'cataloged_at:desc':
        return __('Latest', 'surecart');
      case 'cataloged_at:asc':
        return __('Oldest', 'surecart');
      case 'name:asc':
        return __('Alphabetical, A-Z', 'surecart');
      case 'name:desc':
        return __('Alphabetical, Z-A', 'surecart');
      default:
        return __('Sort', 'surecart');
    }
  }

  toggleSelectCollection(collection: Collection) {
    // if collection not in selectedCollections, add it, otherwise remove it
    if (!this.selectedCollections.find(c => c.id === collection.id)) {
      this.selectedCollections = [...this.selectedCollections, collection];
    } else {
      this.selectedCollections = this.selectedCollections.filter(c => c.id !== collection.id);
    }
  }

  getCollectionsAfterFiltered() {
    return (this.collections ?? []).filter(collection => {
      return !this.selectedCollections.some(selected => selected.id === collection.id);
    });
  }

  isPaginationAvailable() {
    return !!this.products?.length && this.pagination.total > this.products.length && this.paginationEnabled;
  }

  render() {
    return (
      <div
        class={{
          'product-item-list__wrapper': true,
          'product-item-list__has-search': !!this.query,
        }}
      >
        {this.error && (
          <sc-alert type="danger" open>
            {this.error}
          </sc-alert>
        )}
        {(this.searchEnabled || this.sortEnabled || this.collectionEnabled) && (
          <div class="product-item-list__header">
            <div class="product-item-list__controls">
              <div class="product-item-list__sort">
                {this.sortEnabled && (
                  <sc-dropdown style={{ '--panel-width': '15em' }}>
                    <sc-button type="text" caret slot="trigger">
                      <sc-visually-hidden>{__('Dropdown to sort products.', 'surecart')} </sc-visually-hidden>
                      {this.renderSortName()}
                      <sc-visually-hidden> {__('selected.', 'surecart')}</sc-visually-hidden>
                    </sc-button>
                    <sc-menu aria-label={__('Sort Products', 'surecart')}>
                      <sc-menu-item aria-label={__('Sort by latest', 'surecart')} onClick={() => (this.sort = 'cataloged_at:desc')}>
                        {__('Latest', 'surecart')}
                      </sc-menu-item>
                      <sc-menu-item aria-label={__('Sort by oldest', 'surecart')} onClick={() => (this.sort = 'cataloged_at:asc')}>
                        {__('Oldest', 'surecart')}
                      </sc-menu-item>
                      <sc-menu-item aria-label={__('Sort by name, A to Z', 'surecart')} onClick={() => (this.sort = 'name:asc')}>
                        {__('Alphabetical, A-Z', 'surecart')}
                      </sc-menu-item>
                      <sc-menu-item aria-label={__('Sort by name, Z to A', 'surecart')} onClick={() => (this.sort = 'name:desc')}>
                        {__('Alphabetical, Z-A', 'surecart')}
                      </sc-menu-item>
                    </sc-menu>
                  </sc-dropdown>
                )}

                {this.collectionEnabled && (this.collections ?? []).length > 0 && (
                  <sc-dropdown style={{ '--panel-width': '15rem' }}>
                    <sc-button type="text" caret slot="trigger">
                      <sc-visually-hidden>
                        {sprintf(
                          __('Dropdown to filter products by collection. %s selected.', 'surecart'),
                          this.selectedCollections?.length ? this.selectedCollections.map(collection => collection?.name).join(',') : __('None', 'surecart'),
                        )}
                      </sc-visually-hidden>
                      <span aria-hidden> {__('Filter', 'surecart')}</span>
                    </sc-button>
                    <sc-menu aria-label={__('Filter products', 'surecart')}>
                      {(this.collections ?? []).map(collection => {
                        return (
                          <sc-menu-item
                            checked={this.selectedCollections.some(selected => selected?.id === collection?.id)}
                            onClick={() => this.toggleSelectCollection(collection)}
                            key={collection?.id}
                            aria-label={sprintf(__('Filter by %s', 'surecart'), collection?.name)}
                          >
                            {collection.name}
                          </sc-menu-item>
                        );
                      })}
                    </sc-menu>
                  </sc-dropdown>
                )}
              </div>
              <div class="product-item-list__search">
                {this.searchEnabled &&
                  (this.query?.length && this.query === this.currentQuery ? (
                    <div class="product-item-list__search-tag">
                      <div class="product-item-list__search-label">{__('Search Results:', 'surecart')}</div>
                      <sc-tag
                        clearable
                        onScClear={() => {
                          this.query = '';
                          this.currentQuery = '';
                          this.updateProducts();
                        }}
                        aria-label={sprintf(__('Searched for %s. Press space to clear search.', 'surecart'), this.query)}
                      >
                        {this.query}
                      </sc-tag>
                    </div>
                  ) : (
                    <sc-input
                      type="text"
                      placeholder={__('Search', 'surecart')}
                      size="small"
                      onKeyUp={e => {
                        if (e.key === 'Enter') {
                          this.query = (e.target as any).value;
                          this.updateProducts(true);
                        }
                      }}
                      value={this.query}
                      clearable
                    >
                      {this.query ? (
                        <sc-icon
                          class="clear-button"
                          slot="prefix"
                          name="x"
                          onClick={() => {
                            this.query = '';
                          }}
                        />
                      ) : (
                        <sc-icon slot="prefix" name="search" />
                      )}
                      <sc-button
                        class="search-button"
                        type="link"
                        slot="suffix"
                        busy={this.busy}
                        onClick={() => {
                          this.updateProducts(true);
                        }}
                      >
                        {__('Search', 'surecart')}
                      </sc-button>
                    </sc-input>
                  ))}
              </div>
            </div>
            {this.collectionEnabled && this.selectedCollections.length > 0 && (
              <div class="product-item-list__search-tag">
                {this.selectedCollections.map(collection => (
                  <sc-tag
                    key={collection?.id}
                    clearable
                    onScClear={() => {
                      this.toggleSelectCollection(collection);
                    }}
                  >
                    {collection?.name}
                  </sc-tag>
                ))}
              </div>
            )}
          </div>
        )}

        {!this.products?.length && !this.loading && (
          <sc-empty class="product-item-list__empty" icon="shopping-bag">
            {__('No products found.', 'surecart')}
          </sc-empty>
        )}

        <section class="product-item-list" aria-label={__('Product list', 'surecart')}>
          {this.loading
            ? [...Array(this.products?.length || this.limit || 10)].map((_, index) => (
                <div class="product-item-list__loader" key={index}>
                  {(this.layoutConfig || []).map(layout => {
                    switch (layout.blockName) {
                      case 'surecart/product-item-title':
                        return (
                          <div
                            style={{
                              textAlign: 'var(--sc-product-title-align)',
                            }}
                          >
                            <sc-skeleton
                              style={{
                                width: '80%',
                                display: 'inline-block',
                              }}
                            ></sc-skeleton>
                          </div>
                        );
                      case 'surecart/product-item-image':
                        return (
                          <sc-skeleton
                            style={{
                              'width': '100%',
                              'minHeight': '90%',
                              'aspectRatio': layout.attributes?.ratio ?? '1/1.4',
                              '--sc-border-radius-pill': '12px',
                              'display': 'inline-block',
                            }}
                          ></sc-skeleton>
                        );
                      case 'surecart/product-item-price':
                        return (
                          <div
                            style={{
                              textAlign: 'var(--sc-product-price-align)',
                            }}
                          >
                            <sc-skeleton
                              style={{
                                width: '40%',
                                display: 'inline-block',
                              }}
                            ></sc-skeleton>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ))
            : (this.products || []).map((product, index: number) => {
                return (
                  <sc-product-item
                    key={product?.id}
                    {...(this.products.length - 1 === index
                      ? {
                          'aria-label': sprintf(
                            __('You have reached the end of product list. %s', 'surecart'),
                            this.isPaginationAvailable() ? __('Press tab to browse more products using pagination.', 'surecart') : __('No more products to browse.', 'surecart'),
                          ),
                        }
                      : {})}
                    exportparts="title, price, image"
                    product={product}
                    layoutConfig={this.layoutConfig}
                  ></sc-product-item>
                );
              })}
        </section>
        {this.isPaginationAvailable() && (
          <div
            class={{
              'product-item-list__pagination': true,
              '--is-aligned-left': this.paginationAlignment === 'left',
              '--is-aligned-center': this.paginationAlignment === 'center',
              '--is-aligned-right': this.paginationAlignment === 'right',
            }}
          >
            <sc-pagination
              page={this.page}
              perPage={this.limit}
              total={this.pagination.total}
              totalPages={this.pagination.total_pages}
              totalShowing={this.limit}
              onScNextPage={() => this.doPagination(this.page + 1)}
              onScPrevPage={() => this.doPagination(this.page - 1)}
            ></sc-pagination>
          </div>
        )}
        {(this.busy || this.loading) && <sc-block-ui />}
      </div>
    );
  }
}
