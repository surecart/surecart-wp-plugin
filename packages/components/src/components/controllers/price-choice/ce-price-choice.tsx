import { Component, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { isPriceInCheckoutSession } from '../../../functions/line-items';
import { getPricesAndProducts } from '../../../services/fetch';
import { CheckoutSession, LineItemData, Price, Prices, Products } from '../../../types';

@Component({
  tag: 'ce-price-choice',
  styleUrl: 'ce-price-choice.css',
  shadow: false,
})
export class CePriceChoice {
  /** Id of the price. */
  @Prop({ reflect: true }) priceId: string;

  /** Stores the price */
  @Prop({ mutable: true }) price: Price;

  /** Is this loading */
  @Prop({ mutable: true }) loading: boolean = false;

  /** Label for the choice. */
  @Prop() label: string;

  /** Label for the choice. */
  @Prop() description: string;

  /** Price entities */
  @Prop() prices: Prices = {};

  /** Product entity */
  @Prop() products: Products = {};

  /** Session */
  @Prop() checkoutSession: CheckoutSession;

  /** Default quantity */
  @Prop() quantity: number = 1;

  /** Choice Type */
  @Prop() type: 'checkbox' | 'radio';

  /** Is this checked by default */
  @Prop({ reflect: true }) checked: boolean = false;

  /** Toggle line item event */
  @Event() ceAddLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Add entities */
  @Event() ceAddEntities: EventEmitter<any>;

  /** Refetch if price changes */
  @Watch('priceId')
  handlePriceIdChage() {
    if (this.price && this.price?.id === this.priceId) return;
    this.fetchPriceWithProduct();
  }

  /** Keep price up to date. */
  @Watch('prices')
  handlePricesChange() {
    if (!Object.keys(this.prices || {}).length) return;
    this.price = this?.prices?.[this.priceId];
  }

  /** Fetch on load */
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

  /** Handle choice change. */
  handleChange(checked) {
    const inSession = this.isInCheckoutSession();
    // if checked and not yet in session
    if (!inSession && checked) {
      this.ceAddLineItem.emit({ price_id: this.priceId, quantity: this.quantity });
      return;
    }
    // if in session and not checked
    if (inSession && !checked) {
      this.ceRemoveLineItem.emit({ price_id: this.priceId, quantity: this.quantity });
      return;
    }
  }

  /** Is this price in the checkout session. */
  isInCheckoutSession() {
    return isPriceInCheckoutSession(this.price, this.checkoutSession);
  }

  /** Is this checked */
  isChecked() {
    return this.isInCheckoutSession();
  }

  render() {
    if (this.loading) {
      return (
        <ce-choice name="loading" disabled>
          <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></ce-skeleton>
          {this.description && <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></ce-skeleton>}
        </ce-choice>
      );
    }

    // we need an active price.
    if (!this?.price?.id || this.price?.archived) return null;

    return (
      <ce-choice
        style={{ height: '100%' }}
        value={this.priceId}
        type={this.type}
        checked={this.isChecked()}
        onCeChange={e => {
          this.handleChange(e.detail as boolean);
        }}
      >
        {this.label || this.price.name}

        <span slot="price">
          <ce-format-number type="currency" value={this.price.amount} currency={this.price.currency}></ce-format-number>
        </span>

        <span slot="per">{this.price.recurring_interval ? `/ ${this.price.recurring_interval}` : `once`}</span>

        {this.description && <span slot="description">{this.description}</span>}
      </ce-choice>
    );
  }
}

openWormhole(CePriceChoice, ['prices', 'products', 'checkoutSession']);
