import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Invoice } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-invoices-list',
  styleUrl: 'ce-invoices-list.scss',
  shadow: true,
})
export class CeInvoicesList {
  @Element() el: HTMLCeInvoicesListElement;
  /** Query to fetch invoices */
  @Prop({ mutable: true }) query: {
    page: number;
    per_page: number;
  } = {
    page: 1,
    per_page: 10,
  };
  @Prop() allLink: string;
  @Prop() heading: string;

  @State() invoices: Array<Invoice> = [];

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

  /** Only fetch if visible */
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

  /** Get all orders */
  async getItems() {
    const response = await await apiFetch({
      path: addQueryArgs(`checkout-engine/v1/invoices/`, {
        expand: ['invoice_items', 'charge'],
        ...this.query,
      }),
      parse: false,
    });
    this.pagination = {
      total: response.headers.get('X-WP-Total'),
      total_pages: response.headers.get('X-WP-TotalPages'),
    };
    this.invoices = (await response.json()) as Invoice[];
    return this.invoices;
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.fetchItems();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.fetchItems();
  }

  renderStatusBadge(invoice: Invoice) {
    const { status, charge } = invoice;
    if (typeof charge === 'object') {
      if (charge?.fully_refunded) {
        return <ce-tag type="danger">{__('Refunded', 'surecart')}</ce-tag>;
      }
      if (charge?.refunded_amount) {
        return <ce-tag type="info">{__('Partially Refunded', 'surecart')}</ce-tag>;
      }
    }

    return <ce-order-status-badge status={status}></ce-order-status-badge>;
  }

  renderLoading() {
    return (
      <ce-card noPadding>
        <ce-stacked-list>
          <ce-stacked-list-row style={{ '--columns': '4' }} mobile-size={500}>
            {[...Array(4)].map(() => (
              <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
            ))}
          </ce-stacked-list-row>
        </ce-stacked-list>
      </ce-card>
    );
  }

  renderEmpty() {
    return (
      <div>
        <ce-divider style={{ '--spacing': '0' }}></ce-divider>
        <slot name="empty">
          <ce-empty icon="tag">{__("You don't have any invoices.", 'surecart')}</ce-empty>
        </slot>
      </div>
    );
  }

  renderList() {
    return this.invoices.map(invoice => {
      const { invoice_items, total_amount, currency, created_at, url } = invoice;
      return (
        <ce-stacked-list-row href={url} style={{ '--columns': '4' }} mobile-size={500}>
          <div>
            <ce-format-date class="order__date" date={created_at} type="timestamp" month="short" day="numeric" year="numeric"></ce-format-date>
          </div>
          <div>
            <ce-text
              truncate
              style={{
                '--color': 'var(--ce-color-gray-500)',
              }}
            >
              {sprintf(_n('%s item', '%s items', invoice_items?.pagination?.count || 0, 'surecart'), invoice_items?.pagination?.count || 0)}
            </ce-text>
          </div>
          <div>{this.renderStatusBadge(invoice)}</div>
          <div>
            <ce-format-number type="currency" currency={currency} value={total_amount}></ce-format-number>
          </div>
        </ce-stacked-list-row>
      );
    });
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.invoices?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <ce-card no-padding>
        <ce-stacked-list>{this.renderList()}</ce-stacked-list>
      </ce-card>
    );
  }

  render() {
    return (
      <ce-dashboard-module class="invoices-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Invoice History', 'surecart')}</slot>
        </span>

        {!!this.allLink && !!this.invoices?.length && (
          <ce-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
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
            totalShowing={this?.invoices?.length}
            onCeNextPage={() => this.nextPage()}
            onCePrevPage={() => this.prevPage()}
          ></ce-pagination>
        )}

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
