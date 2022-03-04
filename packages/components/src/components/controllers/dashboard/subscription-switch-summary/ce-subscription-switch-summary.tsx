import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Product, Subscription, ProductGroup, Price } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';
import { translatedInterval } from '../../../../functions/price';

@Component({
  tag: 'ce-subscription-switch-summary',
  styleUrl: 'ce-subscription-switch-summary.scss',
  shadow: true,
})
export class CeSubscriptionSwitchSummary {
  @Element() el: HTMLCeSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() query: object;
  @Prop() heading: string;
  @Prop() productGroupId: ProductGroup;
  @Prop() subscription: Subscription;

  @State() products: Array<Product>;

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
  }

  /** Get all subscriptions */
  async getItems() {
    if (!this.productGroupId) return;
    try {
      this.loading = true;
      this.products = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/products/`, {
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
        this.error = __('Something went wrong', 'checkout_engine');
      }
    } finally {
      this.loading = false;
    }
  }

  async handleSubmit(e) {
    const { plan } = await e.target.getFormJson();
    this.busy = true;
    window.location.href = addQueryArgs(window.location.href, {
      action: 'confirm',
      price_id: plan,
    });
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

    const prices = this.products.map(product => (product as Product)?.prices?.data).flat();

    return (
      <ce-choices required>
        <div>
          {prices.map(price => {
            const currentPlan = (this.subscription?.price as Price)?.id === price?.id;
            const product = this.products.find(product => product.id === price?.product);
            return (
              <ce-choice key={price?.id} checked={currentPlan} name="plan" value={price?.id}>
                <div>
                  <strong>{product?.name}</strong>
                </div>
                <div slot="description">
                  <ce-format-number type="currency" currency={price?.currency || 'usd'} value={price.amount}></ce-format-number>{' '}
                  {translatedInterval(price?.recurring_interval_count, price?.recurring_interval, ' /')}
                </div>
                {currentPlan && (
                  <ce-tag type="warning" slot="price">
                    {__('Current Plan', 'checkout_engine')}
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
    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    return (
      <ce-form
        class={{
          'subscriptions-switch': true,
        }}
        onCeFormSubmit={e => this.handleSubmit(e)}
      >
        <ce-heading>{this.heading || __('Summary', 'checkout_engine')}</ce-heading>

        <ce-card>
          <ce-line-item></ce-line-item>
        </ce-card>

        {this.busy && <ce-block-ui style={{ zIndex: '9' }}></ce-block-ui>}
      </ce-form>
    );
  }
}
