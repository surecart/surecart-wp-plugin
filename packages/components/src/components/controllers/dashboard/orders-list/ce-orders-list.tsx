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
  @Prop() query: object;
  @Prop() listTitle: string;

  @State() orders: Array<Order> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getOrders();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all orders */
  async getOrders() {
    if (!this.query) return;
    try {
      this.loading = true;
      this.orders = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/orders/`, {
          expand: ['line_items', 'charge'],
          ...this.query,
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
        <ce-stacked-list>
          <ce-stacked-list-row style={{ '--columns': '4' }} mobile-size={500}>
            {[...Array(4)].map(() => (
              <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
            ))}
          </ce-stacked-list-row>
        </ce-stacked-list>
      );
    }

    return (
      <ce-stacked-list>
        {this.orders.map(({ id, line_items, total_amount, currency, status, charge, created_at }) => {
          return (
            <ce-stacked-list-row
              href={addQueryArgs(window.location.href, {
                action: 'show',
                model: 'order',
                id,
              })}
              style={{ '--columns': '4' }}
              mobile-size={500}
            >
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
              <div>
                <ce-order-status-badge status={status}></ce-order-status-badge>
              </div>
              <div>
                <ce-format-number type="currency" currency={currency} value={total_amount}></ce-format-number>
              </div>
            </ce-stacked-list-row>
          );
        })}
      </ce-stacked-list>
    );
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
          'orders-list': true,
          'orders-list--has-title': !!this.listTitle,
        }}
      >
        <div class="orders-list__heading">
          <div class="orders-list__title">
            <slot name="title">{this.listTitle}</slot>
          </div>
          <a href="#">
            {__('View all', 'checkout_engine')} <ce-icon name="chevron-right"></ce-icon>
          </a>
        </div>
        <ce-card no-padding>{this.renderContent()}</ce-card>
      </div>
    );
  }
}
