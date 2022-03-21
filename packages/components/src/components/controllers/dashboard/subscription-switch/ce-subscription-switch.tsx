import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Product, Subscription, ProductGroup, Price } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';
import { translatedInterval } from '../../../../functions/price';

@Component({
  tag: 'ce-subscription-switch',
  styleUrl: 'ce-subscription-switch.scss',
  shadow: true,
})
export class CeSubscriptionSwitch {
  @Element() el: HTMLCeSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() query: object;
  @Prop() heading: string;
  @Prop() productGroupId: ProductGroup;
  @Prop() subscription: Subscription;

  /** Holds the products */
  @State() products: Array<Product>;

  /** Holds the prices */
  @State() prices: Array<Price>;

  /** Filter state */
  @State() filter: 'month' | 'week' | 'year' | 'never' = 'month';

  @State() hasFilters: {
    month: boolean;
    week: boolean;
    year: boolean;
    never: boolean;
  };

  /** Loading state */
  @State() loading: boolean;

  /** Busy state */
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getItems();
    });
    this.handleSubscriptionChange();
  }

  @Watch('products')
  handleProductsChange() {
    this.prices = this.products.map(product => (product as Product)?.prices?.data).flat();
  }

  @Watch('prices')
  handlePricesChange() {
    this.hasFilters = {
      ...this.hasFilters,
      month: this.prices.some(price => price.recurring_interval === 'month'),
      year: this.prices.some(price => price.recurring_interval === 'year'),
      never: this.prices.some(price => price.recurring_interval === 'never'),
    };
  }

  @Watch('subscription')
  handleSubscriptionChange() {
    this.filter = (this.subscription?.price as Price)?.recurring_interval || 'month';
  }

  /** Get all subscriptions */
  async getItems() {
    if (!this.productGroupId) return;
    try {
      this.loading = true;
      this.products = (await await apiFetch({
        path: addQueryArgs(`surecart/v1/products/`, {
          product_group_ids: [this.productGroupId],
          expand: ['prices'],
          ...this.query,
        }),
      })) as Product[];
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
  }

  async handleSubmit(e) {
    const { plan } = await e.target.getFormJson();
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

    return (
      <ce-flex slot="end" class="subscriptions-switch__switcher">
        {this.hasFilters.month && (
          <ce-button onClick={() => (this.filter = 'month')} size="small" type={this.filter === 'month' ? 'default' : 'text'}>
            {__('Monthly', 'surecart')}
          </ce-button>
        )}
        {this.hasFilters.week && (
          <ce-button onClick={() => (this.filter = 'week')} size="small" type={this.filter === 'week' ? 'default' : 'text'}>
            {__('Weekly', 'surecart')}
          </ce-button>
        )}
        {this.hasFilters.year && (
          <ce-button onClick={() => (this.filter = 'year')} size="small" type={this.filter === 'year' ? 'default' : 'text'}>
            {__('Yearly', 'surecart')}
          </ce-button>
        )}
        {this.hasFilters.never && (
          <ce-button onClick={() => (this.filter = 'never')} size="small" type={this.filter === 'never' ? 'default' : 'text'}>
            {__('Lifetime', 'surecart')}
          </ce-button>
        )}
      </ce-flex>
    );
  }

  renderLoading() {
    return (
      <ce-choice name="loading" disabled>
        <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
        <ce-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></ce-skeleton>
        <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></ce-skeleton>
      </ce-choice>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this?.products?.length) {
      return;
    }

    return (
      <ce-choices required>
        <div>
          {(this.prices || []).map(price => {
            const currentPlan = (this.subscription?.price as Price)?.id === price?.id;
            const product = this.products.find(product => product.id === price?.product);
            return (
              <ce-choice key={price?.id} checked={currentPlan} name="plan" value={price?.id} hidden={this.filter !== price.recurring_interval}>
                <div>
                  <strong>{product?.name}</strong>
                </div>
                <div slot="description">
                  <ce-format-number type="currency" currency={price?.currency || 'usd'} value={price.amount}></ce-format-number>{' '}
                  {translatedInterval(price?.recurring_interval_count, price?.recurring_interval, ' /')}
                </div>
                {currentPlan && (
                  <ce-tag type="warning" slot="price">
                    {__('Current Plan', 'surecart')}
                  </ce-tag>
                )}
              </ce-choice>
            );
          })}
        </div>
      </ce-choices>
    );
  }

  render() {
    return (
      <ce-dashboard-module heading={this.heading || __('Update Plan', 'surecart')} class="subscription-switch" error={this.error}>
        <span slot="end">{this.renderSwitcher()}</span>
        <ce-form class="subscriptions-switch" onCeFormSubmit={e => this.handleSubmit(e)}>
          {this.renderContent()}

          <ce-button type="primary" full submit loading={this.loading || this.busy}>
            {__('Next', 'surecart')} <ce-icon name="arrow-right" slot="suffix"></ce-icon>
          </ce-button>

          {this.busy && <ce-block-ui style={{ zIndex: '9' }}></ce-block-ui>}
        </ce-form>
      </ce-dashboard-module>
    );
  }
}
