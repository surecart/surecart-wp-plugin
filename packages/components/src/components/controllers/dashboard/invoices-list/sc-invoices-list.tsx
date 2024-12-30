import { Component, Element, h, Prop, State } from '@stencil/core';
import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { Checkout, Invoice, Order } from '../../../../types';

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
  @Prop() isCustomer: boolean;

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
      await this.getInvoices();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchInvoices() {
    try {
      this.busy = true;
      await this.getInvoices();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all invoices */
  async getInvoices() {
    if (!this.isCustomer) {
      return;
    }
    const response = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/invoices/`, {
        expand: ['checkout'],
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
    this.fetchInvoices();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.fetchInvoices();
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
          <sc-empty icon="shopping-bag">{__("You don't have any invoices.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  getInvoiceRedirectUrl(invoice: Invoice) {
    // if it's open, redirect to checkout for payment.
    if (invoice.status === 'open') {
      return `${window.scData.pages.checkout}?checkout_id=${(invoice?.checkout as Checkout)?.id}`;
    }

    // else it's paid(as we're fetching only open/paid), redirect to order detail page.
    return addQueryArgs(window.location.href, {
      action: 'show',
      model: 'order',
      id: ((invoice?.checkout as Checkout)?.order as Order)?.id,
    });
  }

  renderList() {
    return this.invoices.map(invoice => {
      const { checkout, due_date_date } = invoice;
      if (!checkout) return null;
      const { amount_due, currency } = checkout as Checkout;
      return (
        <sc-stacked-list-row href={this.getInvoiceRedirectUrl(invoice)} style={{ '--columns': '4' }} mobile-size={500}>
          <div>#{invoice?.order_number}</div>
          <div>{due_date_date && invoice?.status === 'open' ? sprintf(__('Due %s', 'surecart'), due_date_date) : '—'}</div>
          <div class="invoices-list__status">
            <sc-invoice-status-badge status={invoice?.status}></sc-invoice-status-badge>
          </div>
          <div>
            <sc-format-number type="currency" currency={currency} value={amount_due}></sc-format-number>
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
          <slot name="heading">{this.heading || __('Invoices', 'surecart')}</slot>
        </span>

        {!!this.allLink && !!this.invoices?.length && (
          <sc-button type="link" href={this.allLink} slot="end" aria-label={sprintf(__('View all %s', 'surecart'), this.heading || __('Invoices', 'surecart'))}>
            {__('View all', 'surecart')}
            <sc-icon aria-hidden="true" name="chevron-right" slot="suffix"></sc-icon>
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
