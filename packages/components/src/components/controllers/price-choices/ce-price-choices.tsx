import { Component, h, Prop, Element, Event, EventEmitter, State } from '@stencil/core';
import { Product, LineItemData, CheckoutSession, ChoiceType, PriceChoice, Prices, Products } from '../../../types';
import { openWormhole } from 'stencil-wormhole';
import { getAvailablePricesForProduct, getProductIdsFromPriceChoices } from '../../../functions/choices';
import { isProductInCheckoutSession } from '../../../functions/line-items';

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: true,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  @Prop() default: string;
  @Prop() priceChoices: Array<PriceChoice>;
  @Prop() products: Products;
  @Prop() prices: Prices;
  @Prop() columns: number = 1;
  @Prop() checkoutSession: CheckoutSession;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() currencyCode: string;
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() productLabel: string;
  @Prop() priceLabel: string;
  @Prop() choiceType: ChoiceType = 'all';

  /** Store the selected prices*/
  @State() selectedPrices: Array<string> = [];

  /** Store selected product ids */
  @State() selectedProductIds: Array<string> = [];

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<{ key: string; value: Array<LineItemData> }>;

  /** Add line items event. */
  @Event() ceAddLineItem: EventEmitter<LineItemData>;

  /** Add line items event. */
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Store the container ref */
  container: HTMLDivElement;

  /**
   * Render the loading indicator
   * @param number
   * @returns
   */
  renderLoading(number: number, descriptions = true, label = false) {
    return (
      <ce-choices label={label ? <ce-skeleton style={{ width: '120px', display: 'inline-block' }}></ce-skeleton> : ''} style={{ '--columns': this.columns.toString() }}>
        {[...Array(number)].map((_, index) => {
          return (
            <ce-choice name="loading" key={index} disabled>
              <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
              {descriptions && <ce-skeleton style={{ width: '140px', display: 'inline-block' }} slot="description"></ce-skeleton>}
              <ce-skeleton style={{ width: '20px', display: 'inline-block' }} slot="price"></ce-skeleton>
              {descriptions && <ce-skeleton style={{ width: '40px', display: 'inline-block' }} slot="per"></ce-skeleton>}
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }

  onProductChange(e) {
    const prices = this.priceChoices.filter(price => price.product_id === e.target.value);
    if (e.target.checked) {
      this.ceAddLineItem.emit({ price_id: prices[0].id, quantity: prices[0].quantity });
    } else {
      prices.forEach(price => {
        this.ceRemoveLineItem.emit({ price_id: price.id, quantity: price.quantity });
      });
    }
  }

  renderProductSelector() {
    // bail if no products or only one product
    const productIds = getProductIdsFromPriceChoices(this.priceChoices);
    if (productIds?.length < 2) return;

    // render loading.
    if (this.loading) {
      return this.renderLoading(productIds.length, true, true);
    }

    // bail if no products.
    if (!Object.keys(this.products || {})?.length) {
      return;
    }

    return (
      <ce-choices label={this.productLabel} class="loaded product-selector" style={{ '--columns': this.columns.toString() }}>
        {(productIds || []).map(id => {
          const product = this.products?.[id];
          if (!product || product?.archived) return;
          const availablePrices = getAvailablePricesForProduct(product, this.prices, this.priceChoices);
          return (
            <ce-choice
              class="loaded"
              key={product.id}
              value={product.id}
              type={this.choiceType === 'multiple' ? 'checkbox' : 'radio'}
              onCeChange={e => this.onProductChange(e)}
              checked={isProductInCheckoutSession(product, this.checkoutSession)}
            >
              {product.name}

              <span slot="description">{product.description}</span>

              {availablePrices.length === 1 && (
                <span slot="price">
                  <ce-format-number type="currency" value={availablePrices[0].amount} currency={availablePrices[0].currency}></ce-format-number>
                </span>
              )}

              {availablePrices.length === 1 && <span slot="per">{availablePrices[0].recurring_interval ? `/ ${availablePrices[0].recurring_interval}` : `once`}</span>}
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }

  /** Is the product selected in the UI */
  isProductSelected(product: Product) {
    return isProductInCheckoutSession(product, this.checkoutSession);
  }

  /**
   * Render each price selector.
   */
  renderPriceSelectors() {
    if (this.loading) {
      const productId = this.priceChoices?.[0]?.product_id;
      const firstProduct = this.priceChoices.filter(price => price.product_id === productId);
      return this.renderLoading(firstProduct?.length, false);
    }

    return Object.keys(this.products || {}).map(id => {
      const product = this.products[id];
      const choices = this.priceChoices.filter(c => c.product_id === product.id && c.enabled);
      // only if product is selected
      if (this.isProductSelected(product)) {
        const label = this.choiceType === 'multiple' ? `${this.priceLabel} - ${product.name}` : this.priceLabel;
        return <ce-price-selector key={id} label={label} columns={this.columns} choices={choices}></ce-price-selector>;
      }
    });
  }

  render() {
    // we don't want the user to choose.
    if (this.choiceType === 'all') {
      return;
    }

    // we need products to select.
    if (!this?.priceChoices?.length) {
      return;
    }

    // render the product selector.
    return (
      <div class="price-choices" ref={el => (this.container = el as HTMLDivElement)}>
        {this.renderProductSelector()}
        {this.renderPriceSelectors()}
        {this.busy && <ce-block-ui z-index={2}></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CePriceChoices, ['currencyCode', 'products', 'prices', 'priceChoices', 'checkoutSession', 'loading', 'busy', 'choiceType'], false);
