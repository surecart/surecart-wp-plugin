import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
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
  };

  @Prop() listTitle: string;

  @State() charges: Array<Charge> = [];

  /** Loading state */
  @State() loading: boolean;
  @State() loaded: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  @State() pagination: {
    total: number;
    total_pages: number;
  } = {
    total: 0,
    total_pages: 0,
  };

  @State() hasNextPage: boolean;
  @State() hasPreviousPage: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getItems();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  @Watch('pagination')
  handlePaginationChange() {
    this.hasNextPage = this.pagination.total_pages > 1 && this.query?.page < this.pagination.total_pages;
    this.hasPreviousPage = this.pagination.total_pages > 1 && this.query?.page > 1;
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
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
      this.loaded = true;
    }
  }

  renderOrderInvoiceNumber(charge: Charge) {
    if (typeof charge?.order === 'object' && charge.order?.number) {
      return sprintf(__('Order #%s', 'checkout_engine'), charge.order.number);
    }
    if (typeof charge?.invoice === 'object' && charge.invoice?.number) {
      return sprintf(__('Invoice #%s', 'checkout_engine'), charge.invoice.number);
    }
  }

  renderRefundStatus(charge: Charge) {
    if (charge?.fully_refunded) {
      return <ce-tag type="danger">{__('Refunded', 'checkout_engine')}</ce-tag>;
    }

    if (charge?.refunded_amount) {
      return <ce-tag type="warning">{__('Partially Refunded', 'checkout_engine')}</ce-tag>;
    }

    return <ce-tag type="success">{__('Paid', 'checkout_engine')}</ce-tag>;
  }

  renderEmpty() {
    return <slot name="empty">{__('You have no saved payment methods.', 'checkout_engine')}</slot>;
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
    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    return (
      <div
        class={{
          'charges-list': true,
        }}
      >
        <ce-heading>{this.listTitle || __('Payment History', 'checkout_engine')}</ce-heading>
        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
        {(this.hasPreviousPage || this.hasNextPage) &&
          (() => {
            const from = this.query.per_page * (this.query.page - 1) + 1;
            const to = Math.min(from + this.charges.length - 1, this.pagination.total);
            const total = this.pagination.total;
            return (
              <ce-flex>
                <div>{sprintf(__('Displaying %1d to %2d of %3d items', 'checkout_engine'), from, to, total)}</div>
                <ce-flex>
                  <ce-button onClick={() => this.prevPage()} disabled={!this.hasPreviousPage} size="small">
                    {__('Previous', 'checkout_engine')}
                  </ce-button>
                  <ce-button onClick={() => this.nextPage()} disabled={!this.hasNextPage} size="small">
                    {__('Next', 'checkout_engine')}
                  </ce-button>
                </ce-flex>
              </ce-flex>
            );
          })()}
        {this.loading && this.loaded && <ce-block-ui spinner></ce-block-ui>}
      </div>
    );
  }
}
