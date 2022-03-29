import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Invoice } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-invoices-list',
  styleUrl: 'sc-invoices-list.scss',
  shadow: true,
})
export class ScInvoicesList {
  @Element() el: HTMLScInvoicesListElement;
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
    const response = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/invoices/`, {
        expand: ['invoice_items', 'charge'],
        ...this.query,
      }),
      parse: false,
    })) as Response;
    this.pagination = {
      total: parseInt(response.headers.get('X-WP-Total')),
      total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
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
        return <sc-tag type="danger">{__('Refunded', 'surecart')}</sc-tag>;
      }
      if (charge?.refunded_amount) {
        return <sc-tag type="info">{__('Partially Refunded', 'surecart')}</sc-tag>;
      }
    }

    return <sc-order-status-badge status={status}></sc-order-status-badge>;
  }

  renderLoading() {
    return (
      <sc-card noPadding>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '4' }} mobile-size={500}>
            {[...Array(4)].map(() => (
              <sc-skeleton style={{ width: '100px', display: 'inline-block' }}></sc-skeleton>
            ))}
          </sc-stacked-list-row>
        </sc-stacked-list>
      </sc-card>
    );
  }

  renderEmpty() {
    return (
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="tag">{__("You don't have any invoices.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderList() {
    return this.invoices.map(invoice => {
      const { invoice_items, total_amount, currency, created_at, url } = invoice;
      return (
        <sc-stacked-list-row href={url} style={{ '--columns': '4' }} mobile-size={500}>
          <div>
            <sc-format-date class="order__date" date={created_at} type="timestamp" month="short" day="numeric" year="numeric"></sc-format-date>
          </div>
          <div>
            <sc-text
              truncate
              style={{
                '--color': 'var(--sc-color-gray-500)',
              }}
            >
              {sprintf(_n('%s item', '%s items', invoice_items?.pagination?.count || 0, 'surecart'), invoice_items?.pagination?.count || 0)}
            </sc-text>
          </div>
          <div>{this.renderStatusBadge(invoice)}</div>
          <div>
            <sc-format-number type="currency" currency={currency} value={total_amount}></sc-format-number>
          </div>
        </sc-stacked-list-row>
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
      <sc-card no-padding>
        <sc-stacked-list>{this.renderList()}</sc-stacked-list>
      </sc-card>
    );
  }

  render() {
    return (
      <sc-dashboard-module class="invoices-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Invoice History', 'surecart')}</slot>
        </span>

        {!!this.allLink && !!this.invoices?.length && (
          <sc-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
            <sc-icon name="chevron-right" slot="suffix"></sc-icon>
          </sc-button>
        )}

        {this.renderContent()}

        {!this.allLink && (
          <sc-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.invoices?.length}
            onScNextPage={() => this.nextPage()}
            onScPrevPage={() => this.prevPage()}
          ></sc-pagination>
        )}

        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
