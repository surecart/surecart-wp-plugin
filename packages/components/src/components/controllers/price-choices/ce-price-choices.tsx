import { Component, h, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';
import { Product, Price, LineItemData, CheckoutSession, ChoiceType, PriceChoice, Prices, Products } from '../../../types';
import { getSiblings } from './functions';
import { openWormhole } from 'stencil-wormhole';
import { getAvailablePricesForProduct, getChoicePrices, getProductIdsFromPriceChoices } from '../../../functions/choices';
import { convertLineItemsToLineItemData, isPriceInCheckoutSession, isProductInCheckoutSession } from '../../../functions/line-items';

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

  @State() selectedProductIds: Array<string>;
  @State() selectedPriceIds: Array<string>;
  @State() availablePrices: Array<Price>;

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<{ key: string; value: Array<LineItemData> }>;

  /** Add line items event. */
  @Event() ceAddLineItems: EventEmitter<Array<LineItemData>>;

  /**
   * Maybe automatically add the product if radio type.
   */
  maybeUpdateSelectedPrices(e: any) {
    const choices = getSiblings(e.target);
    const selectedChoices = Array.from(choices).filter(choice => choice.checked && !choice.disabled);
    this.selectedProductIds = selectedChoices.map(choice => choice.value);

    if (!e.target.checked) return;
    this.maybeAutoChooseSinglePrice(e.target.value);
  }

  // when product selection changes, we need to maybe remove prices from cart
  @Watch('selectedProductIds')
  handleProductSwitch() {
    const productIds = getProductIdsFromPriceChoices(this.priceChoices);
    // get productIds that don't exist in the priceChoices
    const unCheckedProductIds = productIds.filter(productId => !this.selectedProductIds.includes(productId));
    const priceIdsToRemove = this.priceChoices.filter(choice => unCheckedProductIds.includes(choice.product_id)).map(choice => choice.id);
    const lineItemData = convertLineItemsToLineItemData(this.checkoutSession.line_items);
    const updatedLineItems = lineItemData.filter(lineItem => !priceIdsToRemove.includes(lineItem.price_id));
    if (updatedLineItems.length !== lineItemData.length) {
      this.ceUpdateLineItems.emit({ key: 'choices', value: updatedLineItems });
    }
  }

  maybeAutoChooseSinglePrice(productId: string) {
    if (this.choiceType !== 'single') return;
    const firstPriceChoice = this.priceChoices.filter(price => price.product_id === productId)?.[0];

    this.ceUpdateLineItems.emit({
      key: 'choices',
      value: [
        {
          price_id: firstPriceChoice.id,
          quantity: firstPriceChoice.quantity,
        },
      ],
    });
  }

  getSelectedChoices(target) {
    const choices = getSiblings(target);
    return Array.from(choices).filter(choice => choice.checked && !choice.disabled);
  }

  /**
   * Update selected prices when ce-choice changes
   *
   * @param e
   */
  updateSelectedPrices(e) {
    const selectedChoices = this.getSelectedChoices(e.target);
    const prices = getChoicePrices(this.priceChoices);
    const selected = prices
      .filter(price => selectedChoices.find(c => c.value === price.id))
      .map(price => {
        return { price_id: price.id, quantity: price.quantity };
      });

    // only emit if changed
    const existingPriceIds = this.checkoutSession.line_items.data.map(l => l.price.id);
    const same = selected.every(item => existingPriceIds.includes(item.price_id));
    if (same) return;

    this.ceUpdateLineItems.emit({
      key: 'choices',
      value: selected,
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
              onCeChange={e => this.maybeUpdateSelectedPrices(e)}
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

  isProductSelected(product: Product) {
    if (this.busy) {
      return this.selectedProductIds?.includes(product.id);
    }

    // it's selected if it's in the cart
    if (isProductInCheckoutSession(product, this.checkoutSession)) {
      return true;
    }

    return this.selectedProductIds?.includes(product.id);
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
                onCeChange={e => this.updateSelectedPrices(e)}
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
      <div class="price-choices">
        {this.renderProductSelector()}
        {this.renderPriceSelectors()}
        {this.busy && <ce-block-ui z-index={2}></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CePriceChoices, ['currencyCode', 'products', 'prices', 'priceChoices', 'checkoutSession', 'loading', 'busy', 'choiceType'], false);
