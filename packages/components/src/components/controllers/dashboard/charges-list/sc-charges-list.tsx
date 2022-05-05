import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Charge, Invoice, Order } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-charges-list',
  styleUrl: 'sc-charges-list.scss',
  shadow: true,
})
export class ScChargesList {
  @Element() el: HTMLScChargesListElement;
  /** Query to fetch charges */
  @Prop({ mutable: true }) query: {
    page: number;
    per_page: number;
  } = {
    page: 1,
    per_page: 10,
  };

  @Prop() heading: string;
  @Prop() showPagination: boolean = true;
  @Prop() allLink: string;
  @State() charges: Array<Charge> = [];

  /** Loading state */
  @State() loading: boolean;
  @State() loaded: boolean;

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
      this.getItems();
    });
  }

  /** Get items */
  async getItems() {
    try {
      this.loading = true;
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/charges/`, {
          expand: ['order', 'invoice'],
          ...this.query,
        }),
        parse: false,
      })) as Response;

      this.pagination = {
        total: parseInt(response.headers.get('X-WP-Total')),
        total_pages: parseInt(response.headers.get('X-WP-TotalPages')),
      };
      this.charges = (await response.json()) as Charge[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
      this.loaded = true;
    }
  }

  renderOrderInvoiceNumber(charge: Charge) {
    if (typeof charge?.order === 'object' && charge.order?.number) {
      return sprintf(__('Order #%s', 'surecart'), charge.order.number);
    }
    if (typeof charge?.invoice === 'object' && charge.invoice?.number) {
      return sprintf(__('Invoice #%s', 'surecart'), charge.invoice.number);
    }
  }

  renderRefundStatus(charge: Charge) {
    if (charge?.fully_refunded) {
      return <sc-tag type="danger">{__('Refunded', 'surecart')}</sc-tag>;
    }

    if (charge?.refunded_amount) {
      return <sc-tag type="warning">{__('Partially Refunded', 'surecart')}</sc-tag>;
    }

    return <sc-tag type="success">{__('Paid', 'surecart')}</sc-tag>;
  }

  renderEmpty() {
    return (
      <sc-stacked-list-row mobile-size={0}>
        <slot name="empty">{__('You have no saved payment methods.', 'surecart')}</slot>
      </sc-stacked-list-row>
    );
  }

  renderLoading() {
    return (
      <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
        </div>
      </sc-stacked-list-row>
    );
  }

  renderContent() {
    if (this.loading && !this.loaded) {
      return this.renderLoading();
    }

    if (this.charges?.length === 0) {
      return this.renderEmpty();
    }

    return this.charges.map(charge => {
      const { currency, amount, created_at } = charge;
      return (
        <sc-stacked-list-row style={{ '--columns': '4' }} mobile-size={600} href={(charge?.order as Order)?.url || (charge?.invoice as Invoice)?.url}>
          <strong>
            <sc-format-date date={created_at} type="timestamp" month="short" day="numeric" year="numeric"></sc-format-date>
          </strong>

          <sc-text style={{ '--color': 'var(--sc-color-gray-500)' }}>{this.renderOrderInvoiceNumber(charge)}</sc-text>

          <div>{this.renderRefundStatus(charge)}</div>

          <strong>
            <sc-format-number type="currency" value={amount} currency={currency}></sc-format-number>
          </strong>
        </sc-stacked-list-row>
      );
    });
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.getItems();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.getItems();
  }

  render() {
    return (
      <sc-dashboard-module class="charges-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Payment History', 'surecart')}</slot>
        </span>

        {!!this.allLink && (
          <sc-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
            <sc-icon name="chevron-right" slot="suffix"></sc-icon>
          </sc-button>
        )}

        <sc-card no-padding style={{ '--overflow': 'hidden' }}>
          <sc-stacked-list>{this.renderContent()}</sc-stacked-list>
        </sc-card>

        {this.showPagination && (
          <sc-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.charges?.length}
            onScNextPage={() => this.nextPage()}
            onScPrevPage={() => this.prevPage()}
          ></sc-pagination>
        )}

        {this.loading && this.loaded && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
