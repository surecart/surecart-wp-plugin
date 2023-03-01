import { Component, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { isPriceInOrder } from '../../../../functions/line-items';
import { intervalString } from '../../../../functions/price';
import { getPricesAndProducts } from '../../../../services/fetch';
import { LineItemData, Checkout, Price, Prices, Product, Products, ResponseError } from '../../../../types';

@Component({
  tag: 'sc-price-choice',
  styleUrl: 'sc-price-choice.css',
  shadow: false,
})
export class ScPriceChoice {
  private adHocInput: HTMLScPriceInputElement;
  private choice: HTMLScChoiceElement;

  /** Id of the price. */
  @Prop({ reflect: true }) priceId: string;

  /** Stores the price */
  @Prop({ mutable: true }) price: Price;

  /** Is this loading */
  @Prop({ mutable: true }) loading: boolean = false;

  /** Label for the choice. */
  @Prop() label: string;

  /** Show the label */
  @Prop() showLabel: boolean = true;

  /** Show the price amount */
  @Prop() showPrice: boolean = true;

  /** Show the radio/checkbox control */
  @Prop() showControl: boolean = true;

  /** Label for the choice. */
  @Prop() description: string;

  /** Price entities */
  @Prop() prices: Prices = {};

  /** Product entity */
  @Prop() products: Products = {};

  /** Session */
  @Prop() order: Checkout;

  /** Default quantity */
  @Prop() quantity: number = 1;

  /** Choice Type */
  @Prop() type: 'checkbox' | 'radio';

  /** Is this checked by default */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** Errors from response */
  @Prop() error: ResponseError;

  /** Is this an ad-hoc price choice */
  @Prop({ mutable: true, reflect: true }) isAdHoc: Boolean;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() scRemoveLineItem: EventEmitter<LineItemData>;

  /** Add entities */
  @Event() scAddEntities: EventEmitter<any>;

  /** Stores the error message */
  @State() errorMessage: string;

  /** Stores the error message */
  @State() adHocErrorMessage: string;

  @State() product: Product;

  /** Refetch if price changes */
  @Watch('priceId')
  handlePriceIdChage() {
    if (this.price && this.price?.id === this.priceId) return;
    this.fetchPriceWithProduct();
  }

  /** Keep price up to date. */
  @Watch('prices')
  @Watch('products')
  handlePricesChange() {
    if (!Object.keys(this.prices || {}).length || !Object.keys(this.products || {}).length) return;
    this.price = this?.prices?.[this.priceId];
    this.product = this?.products?.[this?.price?.product as string];
  }

  @Watch('price')
  handlePriscChange() {
    this.isAdHoc = this?.price?.ad_hoc;
  }

  @Watch('error')
  handleErrorsChange() {
    const error = (this?.error?.additional_errors || []).find(error => error?.data?.attribute === 'line_items.ad_hoc_amount');
    this.adHocErrorMessage = error?.message ? error?.message : '';
  }

  @Watch('checked')
  handleCheckedChange() {
    if (this.price?.ad_hoc && this.choice.checked) {
      setTimeout(() => {
        this.adHocInput.triggerFocus();
      }, 50);
      return;
    }
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
        archived: false,
        ids: [this.priceId],
      });
      // add to central store.
      this.scAddEntities.emit({ prices, products });
    } catch (err) {
    } finally {
      this.loading = false;
    }
  }

  /** Is this price in the checkout session. */
  isInOrder() {
    return isPriceInOrder(this.price, this.order);
  }

  /** Is this checked */
  isChecked() {
    return this.isInOrder();
  }

  onChangeAdHoc(e) {
    this.scUpdateLineItem.emit({ price_id: this.priceId, quantity: this.quantity, ad_hoc_amount: e.target.value });
  }

  getLineItem() {
    return (this.order?.line_items?.data || []).find(lineItem => lineItem.price.id === this.priceId);
  }

  /** Show we show the ad hoc price box */
  showAdHoc() {
    if (!this.price?.ad_hoc) {
      return false;
    }
    if (this.isInOrder()) {
      return true;
    }
    return this?.choice?.checked;
  }

  renderAdHoc() {
    return (
      <sc-price-input
        ref={el => (this.adHocInput = el as HTMLScPriceInputElement)}
        required
        label={'Enter an amount'}
        value={(this.getLineItem()?.ad_hoc_amount || this.getLineItem()?.total_amount).toString()}
        onScChange={e => this.onChangeAdHoc(e)}
        min={this.price.ad_hoc_min_amount}
        max={this.price.ad_hoc_max_amount}
      ></sc-price-input>
    );
  }

  renderEmpty() {
    if (window?.wp?.blocks) {
      return (
        <sc-alert type="danger" open style={{ margin: '0px' }}>
          {__('This product has been archived.', 'surecart')}
        </sc-alert>
      );
    }
    return <Host style={{ display: 'none' }}></Host>;
  }

  renderPrice() {
    return (
      <Fragment>
        <span slot="price">
          <sc-format-number type="currency" value={this.price.amount} currency={this.price.currency}></sc-format-number>
        </span>
        <span slot="per">{intervalString(this.price, { labels: { interval: '/', period: __('for', 'surecart') } })}</span>
      </Fragment>
    );
  }

  render() {
    if (this.loading) {
      return (
        <sc-choice name="loading" showLabel={this.showLabel} showPrice={this.showPrice} showControl={this.showControl} disabled>
          <sc-skeleton style={{ width: '60px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></sc-skeleton>
          {this.description && <sc-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></sc-skeleton>}
        </sc-choice>
      );
    }

    // we need an active price.
    if (!this?.price?.id || this.price?.archived) return this.renderEmpty();

    // product needs to be active
    if (this.product?.archived) {
      return this.renderEmpty();
    }

    return (
      <Fragment>
        <sc-choice
          ref={el => (this.choice = el as HTMLScChoiceElement)}
          value={this.priceId}
          type={this.type}
          showLabel={this.showLabel}
          showPrice={this.showPrice}
          showControl={this.showControl}
          checked={this.isChecked()}
        >
          {this.label || this?.price?.name || this?.product?.name}
          {this.description && <span slot="description">{this.description}</span>}
          {this.renderPrice()}
        </sc-choice>
      </Fragment>
    );
  }
}

openWormhole(ScPriceChoice, ['prices', 'products', 'order', 'error'], false);
