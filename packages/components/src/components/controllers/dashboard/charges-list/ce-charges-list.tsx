import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Charge, Invoice, Order } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-charges-list',
  styleUrl: 'ce-charges-list.scss',
  shadow: true,
})
export class CeChargesList {
  @Element() el: HTMLCeChargesListElement;
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
      const response = await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/charges/`, {
          expand: ['order', 'invoice'],
          ...this.query,
        }),
        parse: false,
      });

      this.pagination = {
        total: response.headers.get('X-WP-Total'),
        total_pages: response.headers.get('X-WP-TotalPages'),
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
      return <ce-tag type="danger">{__('Refunded', 'surecart')}</ce-tag>;
    }

    if (charge?.refunded_amount) {
      return <ce-tag type="warning">{__('Partially Refunded', 'surecart')}</ce-tag>;
    }

    return <ce-tag type="success">{__('Paid', 'surecart')}</ce-tag>;
  }

  renderEmpty() {
    return <slot name="empty">{__('You have no saved payment methods.', 'surecart')}</slot>;
  }

  renderLoading() {
    return (
      <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
        </div>
      </ce-stacked-list-row>
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
        <ce-stacked-list-row style={{ '--columns': '4' }} mobile-size={600} href={(charge?.order as Order)?.url || (charge?.invoice as Invoice)?.url}>
          <strong>
            <ce-format-date date={created_at} type="timestamp" month="short" day="numeric" year="numeric"></ce-format-date>
          </strong>

          <ce-text style={{ '--color': 'var(--ce-color-gray-500)' }}>{this.renderOrderInvoiceNumber(charge)}</ce-text>

          <div>{this.renderRefundStatus(charge)}</div>

          <strong>
            <ce-format-number type="currency" value={amount} currency={currency}></ce-format-number>
          </strong>
        </ce-stacked-list-row>
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
      <ce-dashboard-module class="charges-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Payment History', 'surecart')}</slot>
        </span>

        {!!this.allLink && (
          <ce-button type="link" href={this.allLink} slot="end">
            {__('View all', 'surecart')}
            <ce-icon name="chevron-right" slot="suffix"></ce-icon>
          </ce-button>
        )}

        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>

        {this.showPagination && (
          <ce-pagination
            page={this.query.page}
            perPage={this.query.per_page}
            total={this.pagination.total}
            totalPages={this.pagination.total_pages}
            totalShowing={this?.charges?.length}
            onCeNextPage={() => this.nextPage()}
            onCePrevPage={() => this.prevPage()}
          ></ce-pagination>
        )}

        {this.loading && this.loaded && <ce-block-ui spinner></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
