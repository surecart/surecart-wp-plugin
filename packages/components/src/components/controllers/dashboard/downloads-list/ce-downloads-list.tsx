import { Component, Element, h, Prop, State } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { Product, Purchase } from '../../../../types';

@Component({
  tag: 'ce-downloads-list',
  styleUrl: 'ce-downloads-list.scss',
  shadow: true,
})
export class CeDownloadsList {
  @Element() el: HTMLCeDownloadsListElement;
  /** Customer id to fetch subscriptions */
  @Prop({ mutable: true }) query: {
    page: number;
    per_page: number;
  } = {
    page: 1,
    per_page: 10,
  };
  @Prop() allLink: string;
  @Prop() heading: string;
  @Prop() nonce: string;

  @State() purchases: Array<Purchase> = [];

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getItems();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.loading = false;
    }
  }

  async fetchItems() {
    try {
      this.busy = true;
      await this.getItems();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getItems() {
    const response = await await apiFetch({
      path: addQueryArgs(`checkout-engine/v1/purchases/`, {
        expand: ['product', 'product.files'],
        downloadable: true,
        ...this.query,
      }),
      parse: false,
    });
    this.pagination = {
      total: response.headers.get('X-WP-Total'),
      total_pages: response.headers.get('X-WP-TotalPages'),
    };
    this.purchases = (await response.json()) as Purchase[];
    return this.purchases;
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.fetchItems();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.fetchItems();
  }

  renderEmpty() {
    return null;
  }

  renderLoading() {
    return (
      <ce-card no-padding style={{ '--overflow': 'hidden' }}>
        <ce-stacked-list>
          <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
            <div style={{ padding: '0.5em' }}>
              <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
              <ce-skeleton style={{ width: '20%' }}></ce-skeleton>
            </div>
          </ce-stacked-list-row>
        </ce-stacked-list>
      </ce-card>
    );
  }

  renderList() {
    return this.purchases.map(purchase => {
      return (
        <ce-stacked-list-row
          href={
            !purchase?.revoked
              ? addQueryArgs(window.location.href, {
                  action: 'edit',
                  model: 'download',
                  id: purchase.id,
                  nonce: this.nonce,
                })
              : null
          }
          key={purchase.id}
          mobile-size={0}
        >
          <ce-spacing
            style={{
              '--spacing': 'var(--ce-spacing-xx--small)',
            }}
          >
            <div>
              <strong>{(purchase?.product as Product)?.name}</strong>
            </div>
            <div class="download__details">
              {sprintf(
                _n('%s file', '%s files', (purchase?.product as Product)?.files?.pagination?.count, 'checkout_engine'),
                (purchase?.product as Product)?.files?.pagination?.count,
              )}{' '}
              &bull; <ce-format-bytes value={(purchase?.product as Product)?.files?.data.map(item => item.byte_size).reduce((prev, curr) => prev + curr, 0)}></ce-format-bytes>
            </div>
          </ce-spacing>

          <ce-icon name="chevron-right" slot="suffix"></ce-icon>
        </ce-stacked-list-row>
      );
    });
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.purchases?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <ce-card no-padding style={{ '--overflow': 'hidden' }}>
        <ce-stacked-list>{this.renderList()}</ce-stacked-list>
      </ce-card>
    );
  }

  render() {
    return (
      <ce-dashboard-module class="downloads-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Items', 'checkout_engine')}</slot>
        </span>

        {!!this.allLink && this.pagination.total_pages > 1 && (
          <ce-button type="link" href={this.allLink} slot="end">
            {__('View all', 'checkout_engine')}
            <ce-icon name="chevron-right" slot="suffix"></ce-icon>
          </ce-button>
        )}

        {this.renderContent()}

        {!this.allLink && (
          <ce-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.purchases?.length}
            onCeNextPage={() => this.nextPage()}
            onCePrevPage={() => this.prevPage()}
          ></ce-pagination>
        )}

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
