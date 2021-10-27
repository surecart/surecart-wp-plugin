import { Component, h, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';
import { Product, Price, LineItemData, CheckoutSession, ChoiceType, PriceChoice, Prices, Products } from '../../../types';
import { openWormhole } from 'stencil-wormhole';
import { getAvailablePricesForProduct, getProductIdsFromPriceChoices } from '../../../functions/choices';
import { getLineItemByPriceId, isPriceInCheckoutSession, isProductInCheckoutSession } from '../../../functions/line-items';

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
  @Prop() label: string;
  @Prop() choiceType: ChoiceType = 'all';

  @State() selectedProductIds: Array<string> = [];
  @State() selectedPriceIds: Array<string> = [];

  @State() availablePrices: Array<Price>;

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<{ key: string; value: Array<LineItemData> }>;

  /** Add line items event. */
  @Event() ceAddLineItems: EventEmitter<Array<LineItemData>>;

  /** Store the container ref */
  container: HTMLDivElement;

  /** get selected price ids in UI. */
  getSelectedPriceIds(): Array<string> {
    const choices = Array.from(this.container.querySelectorAll('.price-selector ce-choice') as NodeListOf<HTMLCeChoiceElement>);
    return choices.filter(choice => choice.checked && !choice.disabled).map(choice => choice.value);
  }

  /**  get seleted product ids in UI. */
  getSelectedProductIds(): Array<string> {
    const choices = Array.from(this.container.querySelectorAll('.product-selector ce-choice') as NodeListOf<HTMLCeChoiceElement>);
    return choices.filter(choice => choice.checked && !choice.disabled).map(choice => choice.value);
  }

  /** Update selected products when choices change. */
  updateSelectedPrices() {
    this.selectedPriceIds = this.getSelectedPriceIds();
  }

  /** Update selected products when choices change. */
  updateSelectedProducts() {
    this.selectedProductIds = this.getSelectedProductIds();
  }

  @Watch('selectedProductIds')
  handleProductSwitch() {
    setTimeout(() => {
      this.selectedPriceIds = this.getSelectedPriceIds();
      if (this.selectedPriceIds?.length) return;
      if (this.choiceType !== 'single') return;
      const firstPrice = this.container.querySelector('.price-selector ce-choice') as HTMLCeChoiceElement;
      if (firstPrice) firstPrice.checked = true;
    }, 50);
  }

  // // if we need to choose a single price, and there are no prices selected,
  // // select a price
  // if (!this.selectedPriceIds && this.choiceType === 'single') {
  //   const firstPrice = this.container.querySelector('.price-selector ce-choice') as HTMLCeChoiceElement;
  //   firstPrice.checked = true;
  // }

  // // convert to line item data.
  // const value = (this.selectedPriceIds || []).map(price_id => {
  //   const existingLineItem = getLineItemByPriceId(this.checkoutSession.line_items, price_id);
  //   const quantity = existingLineItem?.quantity || this.priceChoices.find(choice => choice.id === price_id)?.quantity;
  //   return { price_id, quantity };
  // });
  // }

  @Watch('selectedPriceIds')
  handlePriceSelectionChange(val, prev) {
    if (!val?.length && !prev?.length) return;
    if (prev?.length && val?.length) {
      const unchanged = val.every((v, i) => v === prev[i]) && prev.every((v, i) => v === val[i]);
      if (unchanged) return;
    }
    // if we need to choose a single price, and there are no prices selected,
    // select a price
    if (!this.selectedPriceIds?.length && this.choiceType === 'single') {
      const firstPrice = this.container.querySelector('.price-selector ce-choice') as HTMLCeChoiceElement;
      if (firstPrice) firstPrice.checked = true;
    }

    // convert to line item data.
    const value = (this.selectedPriceIds || []).map(price_id => {
      const existingLineItem = getLineItemByPriceId(this.checkoutSession.line_items, price_id);
      const quantity = existingLineItem?.quantity || this.priceChoices.find(choice => choice.id === price_id)?.quantity;
      return { price_id, quantity };
    });

    // // only emit if changed
    // const existingPriceIds = this.checkoutSession.line_items.data.map(l => l.price.id);
    // const same = selected.every(item => existingPriceIds.includes(item.price_id));
    // if (same) return;

    this.ceUpdateLineItems.emit({
      key: 'choices',
      value,
    });
  }

  /**
   * Render the loading indicator
   * @param number
   * @returns
   */
  renderLoading(number: number) {
    return (
      <ce-choices style={{ '--columns': this.columns.toString() }}>
        {[...Array(number)].map((_, index) => {
          return (
            <ce-choice name="loading" key={index} disabled>
              <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '140px', display: 'inline-block' }} slot="description"></ce-skeleton>
              <ce-skeleton style={{ width: '20px', display: 'inline-block' }} slot="price"></ce-skeleton>
              <ce-skeleton style={{ width: '40px', display: 'inline-block' }} slot="per"></ce-skeleton>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }

  @Watch('loading')
  @Watch('products')
  handleProductSelectChanges() {
    if (this.loading || !Object.keys(this.products || {}).length) return;
    setTimeout(() => this.updateSelectedProducts());
  }

  renderProductSelector() {
    // bail if no products or only one product
    const productIds = getProductIdsFromPriceChoices(this.priceChoices);
    if (productIds?.length < 2) return;

    // render loading.
    if (this.loading) {
      return this.renderLoading(productIds.length);
    }

    // bail if no products.
    if (!Object.keys(this.products || {})?.length) {
      return;
    }

    return (
      <ce-choices label={this.label} class="loaded product-selector" style={{ '--columns': this.columns.toString() }}>
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
              onCeChange={() => this.updateSelectedProducts()}
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
    return this.getSelectedProductIds().includes(product.id);
  }

  /**
   * Render each price selector.
   */
  renderPriceSelectors() {
    if (this.loading) {
      const productId = this.priceChoices?.[0]?.product_id;
      const firstProduct = this.priceChoices.filter(price => price.product_id === productId);
      return this.renderLoading(firstProduct?.length);
    }

    return Object.keys(this.products || {}).map(id => {
      const product = this.products[id];
      // only if product is selected
      if (this.isProductSelected(product)) {
        return this.renderPriceSelector(product);
      }
    });
  }

  /**
   * Render an individual price selector
   * @param product
   * @returns
   */
  renderPriceSelector(product: Product) {
    const prices = getAvailablePricesForProduct(product, this.prices, this.priceChoices);
    if (!prices || prices?.length < 2) return;

    let label = 'Choose';
    if (this.choiceType === 'multiple') {
      label = label + ' ' + product.name;
    }

    return (
      <ce-form-row>
        <ce-choices label={label} class="loaded price-selector" style={{ '--columns': this.columns.toString() }}>
          {prices.map(price => {
            if (price.archived) return;
            return (
              <ce-choice
                class="loaded"
                value={price.id}
                type={this.choiceType === 'multiple' ? 'checkbox' : 'radio'}
                onCeChange={() => this.updateSelectedPrices()}
                checked={isPriceInCheckoutSession(price, this.checkoutSession)}
              >
                {price.name}
                <span slot="price">
                  <ce-format-number type="currency" value={price.amount} currency={price.currency}></ce-format-number>
                </span>
                <span slot="per">{price.recurring_interval ? `/ ${price.recurring_interval}` : `once`}</span>
              </ce-choice>
            );
          })}
        </ce-choices>
      </ce-form-row>
    );
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
