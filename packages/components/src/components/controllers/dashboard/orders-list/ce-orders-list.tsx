import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Order } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-orders-list',
  styleUrl: 'ce-orders-list.scss',
  shadow: true,
})
export class CeOrdersList {
  @Element() el: HTMLCeOrdersListElement;
  /** Query to fetch orders */
  @Prop({ mutable: true }) query: {
    page: number;
    per_page: number;
  } = {
    page: 1,
    per_page: 10,
  };
  @Prop() allLink: string;
  @Prop() heading: string;

  @State() orders: Array<Order> = [];

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
      await this.getOrders();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.loading = false;
    }
  }

  async fetchOrders() {
    try {
      this.busy = true;
      await this.getOrders();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.busy = false;
    }
  }

  /** Get all orders */
  async getOrders() {
    const response = await await apiFetch({
      path: addQueryArgs(`checkout-engine/v1/orders/`, {
        expand: ['line_items', 'charge'],
        ...this.query,
      }),
      parse: false,
    });
    this.pagination = {
      total: response.headers.get('X-WP-Total'),
      total_pages: response.headers.get('X-WP-TotalPages'),
    };
    this.orders = (await response.json()) as Order[];
    return this.orders;
  }

  nextPage() {
    this.query.page = this.query.page + 1;
    this.fetchOrders();
  }

  prevPage() {
    this.query.page = this.query.page - 1;
    this.fetchOrders();
  }

  renderStatusBadge(order: Order) {
    const { status, charge } = order;
    if (charge && typeof charge === 'object') {
      if (charge?.fully_refunded) {
        return <ce-tag type="danger">{__('Refunded', 'checkout_engine')}</ce-tag>;
      }
      if (charge?.refunded_amount) {
        return <ce-tag type="info">{__('Partially Refunded', 'checkout_engine')}</ce-tag>;
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
          <ce-empty icon="shopping-bag">{__("You don't have any orders.", 'checkout_engine')}</ce-empty>
        </slot>
      </div>
    );
  }

  renderList() {
    return this.orders.map(order => {
      const { line_items, total_amount, currency, charge, created_at, url } = order;
      return (
        <ce-stacked-list-row href={url} style={{ '--columns': '4' }} mobile-size={500}>
          <div>
            {typeof charge !== 'string' && (
              <ce-format-date class="order__date" date={(charge?.created_at || created_at) * 1000} month="short" day="numeric" year="numeric"></ce-format-date>
            )}
          </div>
          <div>
            <ce-text
              truncate
              style={{
                '--color': 'var(--ce-color-gray-500)',
              }}
            >
              {sprintf(_n('%s item', '%s items', line_items?.pagination?.count || 0, 'checkout_engine'), line_items?.pagination?.count || 0)}
            </ce-text>
          </div>
          <div>{this.renderStatusBadge(order)}</div>
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

    if (this.orders?.length === 0) {
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
      <ce-dashboard-module class="orders-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Order History', 'checkout_engine')}</slot>
        </span>

        {!!this.allLink && !!this.orders?.length && (
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
            totalShowing={this?.orders?.length}
            onCeNextPage={() => this.nextPage()}
            onCePrevPage={() => this.prevPage()}
          ></ce-pagination>
        )}

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
