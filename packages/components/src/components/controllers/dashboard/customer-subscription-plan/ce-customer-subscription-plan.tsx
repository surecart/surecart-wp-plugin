import { Component, Prop, h, State, Event, EventEmitter, Watch } from '@stencil/core';
import { getPricesAndProducts } from '../../../../services/fetch';
import { Price, Product, Prices, Products } from '../../../../types';
import { openWormhole } from 'stencil-wormhole';
import { translatedInterval } from '../../../../functions/price';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-customer-subscription-plan',
  styleUrl: 'ce-customer-subscription-plan.scss',
  shadow: true,
})
export class CeCustomerSubscriptionPlan {
  @Prop() current: boolean;
  @Prop() priceId: string;
  @Prop({ mutable: true }) price: Price;
  /** Price entities */
  @Prop() prices: Prices = {};
  /** Product entity */
  @Prop() products: Products = {};
  @State() loading: boolean;

  /** Add entities */
  @Event() ceAddEntities: EventEmitter<any>;

  /** Keep price up to date. */
  @Watch('prices')
  handlePricesChange() {
    if (!Object.keys(this.prices || {}).length) return;
    this.price = this?.prices?.[this.priceId];
  }

  componentWillLoad() {
    if (!this.price) {
      this.fetchPriceWithProduct();
    }
  }

  /** Fetch prices and products */
  async fetchPriceWithProduct() {
    if (!this.priceId) return;
    try {
      this.loading = true;
      const { products, prices } = await getPricesAndProducts({
        active: true,
        ids: [this.priceId],
      });
      // add to central store.
      this.ceAddEntities.emit({ prices, products });
    } catch (err) {
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return (
        <div>
          <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></ce-skeleton>
          <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></ce-skeleton>
        </div>
      );
    }

    // we need an active price.
    if (!this?.price?.id) return null;
    const product = this.products?.[this.price.product as string] as Product;

    return (
      <div class="subscription-plan">
        <div>
          <div class="subscription-plan__name" part="name">
            {product?.name} {this.price?.name}
          </div>
          <div>
            <ce-format-number type="currency" value={this.price.amount} currency={this.price.currency}></ce-format-number>
            {translatedInterval(this.price.recurring_interval_count, this.price.recurring_interval, '/', '')}
          </div>
        </div>
        <div>
          {this.current ? (
            <ce-button type="text">
              <ce-icon name="check" slot="prefix"></ce-icon>
              {__('Current Plan', 'checkout_engine')}
            </ce-button>
          ) : (
            <ce-button size="large">{__('Continue', 'checkout_engine')}</ce-button>
          )}
        </div>
      </div>
    );
  }
}

openWormhole(CeCustomerSubscriptionPlan, ['prices', 'products', 'checkoutSession', 'error'], false);
