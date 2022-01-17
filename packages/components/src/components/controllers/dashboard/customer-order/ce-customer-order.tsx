import { Order, Product } from '../../../../types';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { _n, __ } from '@wordpress/i18n';
import { onFirstVisible } from '../../../../functions/lazy';
import { translatedInterval } from '../../../../functions/price';

@Component({
  tag: 'ce-customer-order',
  styleUrl: 'ce-customer-order.scss',
  shadow: true,
})
export class CeCustomerOrder {
  @Element() el: HTMLCeCustomerOrderElement;
  @Prop() orderId: string;

  @State() order: Order;
  @State() loading: boolean;
  @State() error: string;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.makeRequest();
    });
  }

  /** Get orders */
  async makeRequest(props = {}) {
    if (!this.orderId) return;
    try {
      this.loading = true;
      this.order = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/orders/${this.orderId}`, {
          expand: ['line_items', 'line_item.price', 'price.product'],
          ...props,
        }),
      })) as Order;
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

  render() {
    if (this.loading) {
      return (
        <div class="loading">
          <ce-skeleton style={{ width: '25%' }}></ce-skeleton>
          <ce-skeleton style={{ width: '50%' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
        </div>
      );
    }
    return (
      <div class="order">
        <div class="order__header">{this?.order?.number || this?.order?.id}</div>
        <div class="line-items" part="line-items">
          {this.order?.line_items?.data.map(item => {
            return (
              <ce-product-line-item
                key={item.id}
                imageUrl={(item?.price?.product as Product)?.image_url}
                name={`${(item?.price?.product as Product)?.name} \u2013 ${item?.price?.name}`}
                editable={false}
                removable={false}
                quantity={item.quantity}
                amount={item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount}
                currency={this.order?.currency}
                trialDurationDays={item?.price?.trial_duration_days}
                interval={translatedInterval(item.price.recurring_interval_count, item.price.recurring_interval, '', '')}
              ></ce-product-line-item>
            );
          })}
        </div>
      </div>
    );
  }
}
