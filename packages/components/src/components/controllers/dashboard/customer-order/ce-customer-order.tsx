import { Charge, Order, Product } from '../../../../types';
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

  renderRefundStatus(charge: Charge) {
    if (charge?.fully_refunded) {
      return <ce-tag type="danger">{__('Refunded', 'checkout_engine')}</ce-tag>;
    }

    if (charge?.refunded_amount) {
      return <ce-tag>{__('Partially Refunded', 'checkout_engine')}</ce-tag>;
    }

    return <ce-tag type="success">{__('Paid', 'checkout_engine')}</ce-tag>;
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
      <div>
        <div class="order__header">
          <div>
            <div class="order__number">Order #{this?.order?.number || this?.order?.id}</div>
            <div class="order__title">
              <h2>
                <ce-format-number type="currency" currency={this.order?.currency} value={this.order?.total_amount}></ce-format-number>
              </h2>
              <ce-order-status-badge status={this.order?.status}></ce-order-status-badge>
            </div>
          </div>
          <div class="order__date">
            <div>
              <ce-format-date date={this.order?.created_at * 1000} month="long" day="numeric" year="numeric" hour="numeric" minute="numeric"></ce-format-date>
            </div>
            <div>{!this?.order?.live_mode && <ce-tag type="warning">{__('Test Mode', 'checkout_engine')}</ce-tag>}</div>
          </div>
        </div>

        <ce-card style={{ '--spacing': 'var(--ce-spacing-small)' }} borderless no-divider>
          <span slot="title">
            <slot name="title" />
          </span>

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
          <ce-divider></ce-divider>
          <ce-spacing>
            <ce-line-item>
              <span slot="description">Subtotal</span>
              <span slot="price">
                <ce-format-number type="currency" currency={this.order?.currency} value={this.order?.subtotal_amount}></ce-format-number>
              </span>
            </ce-line-item>
            {!!this.order?.discount_amount && (
              <ce-line-item>
                <span slot="description">Disctoun</span>
                <span slot="price">
                  -<ce-format-number type="currency" currency={this.order?.currency} value={this.order?.discount_amount}></ce-format-number>
                </span>
              </ce-line-item>
            )}
            <ce-line-item style={{ '--price-size': 'var(--ce-font-size-x-large)' }}>
              <span slot="description">Total</span>
              <span slot="price">
                <ce-format-number type="currency" currency={this.order?.currency} value={this.order?.total_amount}></ce-format-number>
              </span>
              <span slot="currency">{this.order?.currency}</span>
            </ce-line-item>
          </ce-spacing>
        </ce-card>
      </div>
    );
  }
}
