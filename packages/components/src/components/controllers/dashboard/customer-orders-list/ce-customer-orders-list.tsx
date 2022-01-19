import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Order } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-customer-orders-list',
  styleUrl: 'ce-customer-orders-list.scss',
  shadow: true,
})
export class CeCustomerOrdersList {
  @Element() el: HTMLCeCustomerOrdersListElement;
  /** Customer id to fetch subscriptions */
  @Prop() customerId: string;
  @Prop() page: number;

  @State() loading: boolean;
  @State() error: string;
  @State() orders: Array<Order>;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.makeRequest();
    });
  }

  /** Get orders */
  async makeRequest(props = {}) {
    if (!this.customerId) return;
    try {
      this.loading = true;
      this.orders = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/orders/`, {
          customer_ids: [this.customerId],
          status: ['paid'],
          expand: ['line_items', 'charge'],
          ...props,
        }),
      })) as Order[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  renderContent() {
    if (this.loading) {
      return (
        <ce-table-row>
          {[...Array(6)].map(() => (
            <ce-table-cell>
              <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
            </ce-table-cell>
          ))}
        </ce-table-row>
      );
    }

    return this.orders.map(({ number, id, line_items, total_amount, currency, status, charge, created_at }) => {
      return (
        <ce-table-row>
          <ce-table-cell>
            <ce-text
              truncate
              style={{
                '--font-weight': 'var(--ce-font-weight-semibold)',
              }}
            >
              {number || id}
            </ce-text>
          </ce-table-cell>
          <ce-table-cell>
            <ce-text
              truncate
              style={{
                '--color': 'var(--ce-color-gray-500)',
              }}
            >
              {sprintf(_n('%s item', '%s items', line_items?.pagination?.count || 0, 'checkout_engine'), line_items?.pagination?.count || 0)}
            </ce-text>
          </ce-table-cell>
          <ce-table-cell>
            <ce-format-number type="currency" currency={currency} value={total_amount}></ce-format-number>
          </ce-table-cell>
          <ce-table-cell>{typeof charge !== 'string' && <ce-format-date date={(charge?.created_at || created_at) * 1000}></ce-format-date>}</ce-table-cell>
          <ce-table-cell>
            <ce-order-status-badge status={status}></ce-order-status-badge>
          </ce-table-cell>
          <ce-table-cell>
            <ce-button
              href={addQueryArgs(window.location.href, {
                order: {
                  id,
                },
              })}
              size="small"
            >
              {__('View', 'checkout_engine')}
            </ce-button>
          </ce-table-cell>
        </ce-table-row>
      );
    });
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

    if (!this.loading && !this?.orders?.length) {
      return (
        <ce-card borderless no-divider>
          <span slot="title">
            <slot name="title" />
          </span>
          <slot name="empty">{__('You have no orders.', 'checkout_engine')}</slot>
        </ce-card>
      );
    }

    return (
      <ce-table>
        <ce-table-cell slot="head">{__('Order', 'checkout_engine')}</ce-table-cell>
        <ce-table-cell slot="head">{__('Items', 'checkout_engine')}</ce-table-cell>
        <ce-table-cell slot="head">{__('Total', 'checkout_engine')}</ce-table-cell>
        <ce-table-cell slot="head">{__('Date', 'checkout_engine')}</ce-table-cell>
        <ce-table-cell slot="head" style={{ width: '100px' }}>
          {__('Status', 'checkout_engine')}
        </ce-table-cell>
        <ce-table-cell slot="head" style={{ width: '100px' }}></ce-table-cell>

        {this.renderContent()}
      </ce-table>
    );
  }
}
