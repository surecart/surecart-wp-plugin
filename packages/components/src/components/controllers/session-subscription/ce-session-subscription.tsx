import { Component, Prop, h, Watch, State } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Subscription } from '../../../types';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../functions/fetch';
import { __ } from '@wordpress/i18n';
import { translatedInterval } from '../../../functions/price';

@Component({
  tag: 'ce-session-subscription',
  styleUrl: 'ce-session-subscription.css',
  shadow: true,
})
export class CeSessionSubscription {
  @Prop() checkoutSessionId: string;
  @State() loading: boolean;
  @State() subscription: Subscription;
  @State() error: string;

  @Watch('checkoutSessionId')
  handleCheckoutSessionChange(val) {
    if (val) {
      this.getSubscription(val);
      // fetch subscription
      console.log('fetch', val);
    }
  }

  /** Update a session */
  async getSubscription(id) {
    try {
      this.loading = true;
      const subscriptions = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
          expand: ['payment_method', 'subscription_items', 'subscription_item.price', 'price.product'],
          checkout_session_ids: [id],
          refresh_status: true,
        }),
      })) as Array<Subscription>;
      this.subscription = subscriptions?.[0];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
    } finally {
      this.loading = false;
    }
  }

  getProduct(item) {
    if (typeof item.price == 'string') return false;
    return item?.price?.product;
  }

  getPrice(item) {
    if (typeof item.price == 'string') return false;
    return item?.price;
  }

  renderLineItems() {
    if (!!this.loading) {
      return (
        <ce-line-item>
          <ce-skeleton style={{ 'width': '50px', 'height': '50px', '--border-radius': '0' }} slot="image"></ce-skeleton>
          <ce-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton slot="description" style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="price"></ce-skeleton>
          <ce-skeleton style={{ width: '60px', display: 'inline-block' }} slot="price-description"></ce-skeleton>
        </ce-line-item>
      );
    }
    return (
      <div class={{ 'confirmation-summary': true }}>
        <div class="line-items" part="line-items">
          {this.subscription?.subscription_items?.data.map(item => {
            const product = this.getProduct(item);
            const price = this.getPrice(item);
            return (
              <ce-product-line-item
                key={item.id}
                imageUrl={product?.image_url}
                name={`${product?.name} \u2013 ${price?.name}`}
                editable={false}
                removable={false}
                quantity={item.quantity}
                amount={price.amount}
                currency={price?.currency}
                trialDurationDays={price?.trial_duration_days}
                interval={translatedInterval(price.recurring_interval_count, price.recurring_interval, '', '')}
              ></ce-product-line-item>
            );
          })}
        </div>
      </div>
    );
  }

  renderSubscription() {
    if (!this.subscription) return;
    return (
      <div class={{ 'line-item-totals': true }}>
        <ce-subscription-status-badge status={this.subscription.status}></ce-subscription-status-badge>
        {this.renderLineItems()}
        <ce-line-item>
          <span slot="description">{__('Subtotal', 'checkout_engine')}</span>
          <ce-format-number slot="price" type="currency" currency={this.subscription?.currency} value={this.subscription?.subtotal_amount}></ce-format-number>
        </ce-line-item>
        <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
        <ce-line-item style={{ '--price-size': 'var(--ce-font-size-x-large)' }}>
          <span slot="title">{__('Total', 'checkout_engine')}</span>
          <ce-format-number slot="price" type="currency" currency={this.subscription?.currency} value={this.subscription?.total_amount}></ce-format-number>
          <span slot="currency">{this.subscription?.currency}</span>
        </ce-line-item>
      </div>
    );
  }

  render() {
    if (!!this.loading) {
      return (
        <ce-card borderless>
          <span slot="title">
            <ce-skeleton style={{ 'width': '50px', 'height': '50px', '--border-radius': '0' }} slot="image"></ce-skeleton>
          </span>
          <ce-line-item>
            <ce-skeleton style={{ 'width': '50px', 'height': '50px', '--border-radius': '0' }} slot="image"></ce-skeleton>
            <ce-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
            <ce-skeleton slot="description" style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
            <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="price"></ce-skeleton>
            <ce-skeleton style={{ width: '60px', display: 'inline-block' }} slot="price-description"></ce-skeleton>
          </ce-line-item>
        </ce-card>
      );
    }

    return (
      <ce-card borderless>
        <span slot="title">
          <slot name="title">
            Subscription{' '}
            {this?.subscription?.live_mode === false && (
              <ce-tag size="small" type="warning">
                {__('Test Mode', 'checkout_engine')}
              </ce-tag>
            )}
          </slot>
        </span>
        {this.renderSubscription()}
      </ce-card>
    );
  }
}

openWormhole(CeSessionSubscription, ['checkoutSessionId'], false);
