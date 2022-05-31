import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { intervalString } from '../../../../functions/price';
import { Price, Product, ProductGroup, Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-switch',
  styleUrl: 'sc-subscription-switch.scss',
  shadow: true,
})
export class ScSubscriptionSwitch {
  @Element() el: HTMLScSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() query: object;
  @Prop() heading: string;
  @Prop() productGroupId: ProductGroup;
  @Prop() productId: string;
  @Prop() subscription: Subscription;

  /** Holds the products */
  @State() products: Array<Product> = [];

  /** Holds the prices */
  @State() prices: Array<Price>;

  /** Filter state */
  @State() filter: 'month' | 'week' | 'year' | 'never' | 'split' = 'month';

  @State() hasFilters: {
    split: boolean;
    month: boolean;
    week: boolean;
    year: boolean;
    never: boolean;
  };

  @State() showFilters: boolean;

  /** Loading state */
  @State() loading: boolean;

  /** Busy state */
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  componentWillLoad() {
    onFirstVisible(this.el, async () => {
      try {
        this.loading = true;
        await Promise.all([this.getGroup(), this.getProductPrices()]);
      } catch (e) {
        console.error(e);
        if (e?.message) {
          this.error = e.message;
        } else {
          this.error = __('Something went wrong', 'surecart');
        }
      } finally {
        this.loading = false;
      }
    });
    this.handleSubscriptionChange();
  }

  @Watch('products')
  handleProductsChange() {
    this.prices = this.products
      .map(product => (product as Product)?.prices?.data)
      .flat()
      .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i); // remove duplicates.

    this.showFilters = this.prices?.length > 4;
  }

  @Watch('prices')
  handlePricesChange() {
    this.hasFilters = {
      ...this.hasFilters,
      split: this.prices.some(price => price.recurring_interval === 'month' && price?.recurring_period_count),
      month: this.prices.some(price => price.recurring_interval === 'month' && !price?.recurring_period_count),
      year: this.prices.some(price => price.recurring_interval === 'year'),
      never: this.prices.some(price => price.recurring_interval === 'never' || !price.recurring_interval),
    };
  }

  @Watch('subscription')
  handleSubscriptionChange() {
    this.filter = (this.subscription?.price as Price)?.recurring_interval || 'month';
  }

  /** Get all subscriptions */
  async getGroup() {
    if (!this.productGroupId) return;
    const products = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/products/`, {
        product_group_ids: [this.productGroupId],
        expand: ['prices'],
        ...this.query,
      }),
    })) as Product[];
    this.products = [...this.products, ...products];
  }

  /** Get the product's prices. */
  async getProductPrices() {
    if (!this.productId) return;
    const product = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/products/${this.productId}`, {
        expand: ['prices'],
      }),
    })) as Product;
    this.products = [...this.products, ...[product]];
  }

  async handleSubmit(e) {
    const { plan } = await e.target.getFormJson();
    const currentPlan = this.subscription?.price as Price;
    if (plan === currentPlan.id) return;
    this.busy = true;
    window.location.assign(
      addQueryArgs(window.location.href, {
        action: 'confirm',
        price_id: plan,
      }),
    );
  }

  renderSwitcher() {
    const hasMultipleFilters = Object.values(this.hasFilters || {}).filter(v => !!v).length > 1;
    if (!hasMultipleFilters) return;
    if (!this.showFilters) return;

    return (
      <sc-flex slot="end" class="subscriptions-switch__switcher">
        {this.hasFilters.month && (
          <sc-button onClick={() => (this.filter = 'month')} size="small" type={this.filter === 'month' ? 'default' : 'text'}>
            {__('Monthly', 'surecart')}
          </sc-button>
        )}
        {this.hasFilters.week && (
          <sc-button onClick={() => (this.filter = 'week')} size="small" type={this.filter === 'week' ? 'default' : 'text'}>
            {__('Weekly', 'surecart')}
          </sc-button>
        )}
        {this.hasFilters.year && (
          <sc-button onClick={() => (this.filter = 'year')} size="small" type={this.filter === 'year' ? 'default' : 'text'}>
            {__('Yearly', 'surecart')}
          </sc-button>
        )}
        {this.hasFilters.never && (
          <sc-button onClick={() => (this.filter = 'never')} size="small" type={this.filter === 'never' ? 'default' : 'text'}>
            {__('Lifetime', 'surecart')}
          </sc-button>
        )}
        {this.hasFilters.split && (
          <sc-button onClick={() => (this.filter = 'split')} size="small" type={this.filter === 'split' ? 'default' : 'text'}>
            {__('Installments', 'surecart')}
          </sc-button>
        )}
      </sc-flex>
    );
  }

  renderLoading() {
    return (
      <sc-choice name="loading" disabled>
        <sc-skeleton style={{ width: '60px', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></sc-skeleton>
        <sc-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></sc-skeleton>
      </sc-choice>
    );
  }

  isHidden(price: Price) {
    if (!this.showFilters) return false;

    let hidden = this.filter !== price.recurring_interval;

    if (this.filter === 'never' && !price?.recurring_interval) {
      hidden = false;
    }

    if (this.filter === 'split' && price?.recurring_period_count) {
      hidden = false;
    }

    return hidden;
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    return (
      <sc-choices required>
        <div>
          {(this.prices || []).map(price => {
            const currentPlan = (this.subscription?.price as Price)?.id === price?.id;
            const product = this.products.find(product => product.id === price?.product);

            return (
              <sc-choice key={price?.id} checked={currentPlan} name="plan" value={price?.id} hidden={this.isHidden(price)}>
                <div>
                  <strong>{product?.name}</strong>
                </div>
                <div slot="description">
                  <sc-format-number type="currency" currency={price?.currency || 'usd'} value={price.amount}></sc-format-number> {intervalString(price)}
                </div>
                {currentPlan && (
                  <sc-tag type="warning" slot="price">
                    {__('Current Plan', 'surecart')}
                  </sc-tag>
                )}
              </sc-choice>
            );
          })}
        </div>
      </sc-choices>
    );
  }

  render() {
    // we are not loading and we don't have enough prices to switch.
    if (!this.loading && this.prices?.length < 2) return null;

    // subscription is a payment plan.
    if (this.subscription?.remaining_period_count) {
      return (
        <sc-alert type="info" open>
          {__('To make changes to your payment plan, please contact us.', 'surecart')}
        </sc-alert>
      );
    }

    return (
      <sc-dashboard-module heading={this.heading || __('Update Plan', 'surecart')} class="subscription-switch" error={this.error}>
        <span slot="end">{this.renderSwitcher()}</span>
        <sc-form class="subscriptions-switch" onScFormSubmit={e => this.handleSubmit(e)}>
          {this.renderContent()}

          <sc-button type="primary" full submit loading={this.loading || this.busy}>
            {__('Next', 'surecart')} <sc-icon name="arrow-right" slot="suffix"></sc-icon>
          </sc-button>

          {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
        </sc-form>
      </sc-dashboard-module>
    );
  }
}
