/**
 * External dependencies.
 */
import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { Collection, Product } from '../../../../types';
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
  @Prop() collectionId: string | null = null;

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

  /* Product list */
  @State() products: Product[];

  /* Loading indicator */
  @State() loading: boolean = false;

  /** Busy indicator */
  @State() busy: boolean = false;

  /* Current page */
  @State() currentPage: number = 1;

  @State() currentQuery: string;

  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };

  /** Collections */
  @State() collections: Collection[];

  /** Selected collections */
  @State() selectedCollections: Collection[];

  componentWillLoad() {
    this.getProducts();

    if (this.collectionEnabled) {
      this.getCollections();
    }

    this.selectedCollections = [];
  }

  // Append URL if no 'product-page' found
  doPagination(page: number) {
    // handle ajax pagination
    if (this.ajaxPagination) {
      this.currentPage = page;
      this.updateProducts();
      this.paginationAutoScroll && this.el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // handle server pagination.
    const newUrl = addQueryArgs(location.href, { 'product-page': page });
    window.location.replace(newUrl);
  }

  getBaseUrl() {
    const baseUrl = 'surecart/v1/products';
    const isIFramed = window?.location?.href === 'about:srcdoc';

    return !isIFramed ? baseUrl : '/wp-json/' + baseUrl;
  }

  // Fetch all products
  async getProducts() {
    const { 'product-page': page } = getQueryArgs(window.location.href) as { 'product-page': string };

    this.currentPage = this.paginationEnabled && page ? parseInt(page) : 1;

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
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/product_collections/`, {
          per_page: 100,
        }),
        parse: false,
      })) as Response;

      this.collections = (await response.json()) as Collection[];
    } catch (error) {
      console.error(error);
    }
  }

  @Watch('sort')
  @Watch('selectedCollections')
  async handleSortChange() {
    this.currentPage = 1;
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

  private debounce;
  @Watch('ids')
  @Watch('limit')
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

    const response = (await apiFetch({
      path: addQueryArgs(this.getBaseUrl(), {
        expand: ['prices', 'product_medias', 'product_media.media'],
        archived: false,
        status: ['published'],
        per_page: this.limit,
        page: this.currentPage,
        sort: this.sort,
        product_collection_ids: collectionIds,
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

  render() {
    return (
      <div class={{ 'product-item-list__wrapper': true, 'product-item-list__has-search': !!this.query }}>
        {(this.searchEnabled || this.sortEnabled || this.collectionEnabled) && (
          <div class="product-item-list__header">
            <div class="product-item-list__sort">
              {this.sortEnabled && (
                <sc-dropdown style={{ '--panel-width': '15em' }}>
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
              )}

              {this.collectionEnabled && (this.collections ?? []).length > 0 && (
                <sc-dropdown style={{ '--panel-width': '15rem' }}>
                  <sc-button type="text" caret slot="trigger">
                    {__('Collections', 'surecart')}
                  </sc-button>
                  <sc-menu>
                    {(this.collections ?? []).map(collection => {
                      return <sc-menu-item onClick={() => this.toggleSelectCollection(collection)}>{collection.name}</sc-menu-item>;
                    })}

                    {(this.collections ?? [])?.length === 0 && <sc-menu-item disabled>{__('No collections available', 'surecart')}</sc-menu-item>}
                  </sc-menu>
                </sc-dropdown>
              )}

              {this.collectionEnabled && this.selectedCollections.length > 0 && (
                <div class="product-item-list__search-tag">
                  <div class="product-item-list__search-label">
                    <span style={{ marginLeft: '5px' }}>{__('Filtered collections:', 'surecart')}</span>
                  </div>
                  {this.selectedCollections.map(collection => (
                    <sc-tag
                      clearable
                      onScClear={() => {
                        this.toggleSelectCollection(collection);
                        this.updateProducts();
                      }}
                    >
                      {collection?.name}
                    </sc-tag>
                  ))}
                </div>
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
                    >
                      {this.query}
                    </sc-tag>
                  </div>
                ) : (
                  <sc-input
                    type="text"
                    placeholder="Search"
                    size="small"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        this.updateProducts();
                      }
                    }}
                    value={this.query}
                    onScInput={e => (this.query = e.target.value)}
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
                    <sc-button class="search-button" type="link" slot="suffix" busy={this.busy} onClick={() => this.updateProducts()}>
                      {__('Search', 'surecart')}
                    </sc-button>
                  </sc-input>
                ))}
            </div>
          </div>
        )}

        {!this.products?.length && !this.loading && (
          <sc-empty class="product-item-list__empty" icon="shopping-bag">
            {__('No products found.', 'surecart')}
          </sc-empty>
        )}

        <div class="product-item-list">
          {this.loading
            ? [...Array(this.ids?.length || this.limit || 10)].map(() => (
                <div class="product-item-list__loader">
                  {this.layoutConfig?.map(layout => {
                    switch (layout.blockName) {
                      case 'surecart/product-item-title':
                        return (
                          <div style={{ textAlign: 'var(--sc-product-title-align)' }}>
                            <sc-skeleton style={{ width: '80%', display: 'inline-block' }}></sc-skeleton>
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
                          <div style={{ textAlign: 'var(--sc-product-price-align)' }}>
                            <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ))
            : (this.products || []).map(product => {
                return <sc-product-item exportparts="title, price, image" product={product} layoutConfig={this.layoutConfig}></sc-product-item>;
              })}
        </div>
        {!!this.products?.length && this.pagination.total > this.products.length && this.paginationEnabled && (
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
              onScNextPage={() => this.doPagination(this.currentPage + 1)}
              onScPrevPage={() => this.doPagination(this.currentPage - 1)}
            ></sc-pagination>
          </div>
        )}
        {(this.busy || this.loading) && <sc-block-ui />}
      </div>
    );
  }
}
