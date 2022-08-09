import { Component, Element, h, Prop, State } from '@stencil/core';
import {  _n, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Order } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-order',
  styleUrl: 'sc-order.scss',
  shadow: true,
})
export class ScOrder {
  @Element() el: HTMLScOrdersListElement;
  @Prop() orderId: string;
  @Prop() heading: string;

  @State() order: Order;

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  /** Only fetch if visible */
  componentDidLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
    try {
      this.loading = true;
      await this.getOrder();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchOrder() {
    try {
      this.busy = true;
      await this.getOrder();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all orders */
  async getOrder() {
    this.order = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/orders/${this.orderId}`, {
        expand: ['checkout', 'checkout.line_items', 'charge'],
      }),
    })) as Order;
  }

  renderLoading() {
    return (
      <sc-card>
          {[...Array(4)].map(() => (
            <sc-skeleton style={{ width: '100px', display: 'inline-block' }}></sc-skeleton>
          ))}
      </sc-card>
    );
  }

  renderEmpty() {
    return (
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="shopping-bag">{__("Order not found.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.order?.id) {
      return this.renderEmpty();
    }

    return (
      <sc-card>

      </sc-card>
    );
  }

  render() {
    return (
      <sc-dashboard-module class="orders-list" error={this.error}>
        <span slot="heading">
          {this.loading ? <sc-skeleton></sc-skeleton> : <span>#{this.order?.number}</span>}
        </span>
      </sc-dashboard-module>
    );
  }
}
