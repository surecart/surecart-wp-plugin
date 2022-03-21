import { Component, Element, h, Prop, State } from '@stencil/core';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { Purchase } from '../../../../types';

@Component({
  tag: 'sc-dashboard-downloads-list',
  styleUrl: 'sc-dashboard-downloads-list.scss',
  shadow: true,
})
export class ScDownloadsList {
  @Element() el: HTMLScDownloadsListElement;
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
  @Prop() requestNonce: string;

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
      this.error = e?.message || __('Something went wrong', 'surecart');
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
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getItems() {
    const response = await await apiFetch({
      path: addQueryArgs(`surecart/v1/purchases/`, {
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

  render() {
    return (
      <sc-downloads-list
        heading={this.heading}
        allLink={this.allLink && this.pagination.total_pages > 1 ? this.allLink : ''}
        loading={this.loading}
        busy={this.busy}
        requestNonce={this.requestNonce}
        error={this.error}
        purchases={this.purchases}
      >
        <span slot="heading">
          <slot name="heading">{this.heading || __('Downloads', 'surecart')}</slot>
        </span>

        <sc-pagination
          slot="after"
          page={this.query.page}
          perPage={this.query.per_page}
          total={this.pagination.total}
          totalPages={this.pagination.total_pages}
          totalShowing={this?.purchases?.length}
          onScNextPage={() => this.nextPage()}
          onScPrevPage={() => this.prevPage()}
        ></sc-pagination>
      </sc-downloads-list>
    );
  }
}
