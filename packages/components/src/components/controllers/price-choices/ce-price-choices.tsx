import { Component, h, Prop, Element, Event, EventEmitter, State } from '@stencil/core';
import { Product, Price, LineItemData, ProductChoices, CheckoutSession, ChoiceType } from '../../../types';
import { getSiblings } from './functions';
import { openWormhole } from 'stencil-wormhole';
import { getAvailablePricesForProduct, getProductChoicePriceByIndex, getChoicePrices } from '../../../functions/choices';
import { isPriceInCheckoutSession, isProductInCheckoutSession } from '../../../functions/line-items';

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: true,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  @Prop() default: string;
  @Prop() productsChoices: ProductChoices;
  @Prop() products: Array<Product>;
  @Prop() columns: number = 1;
  @Prop() checkoutSession: CheckoutSession;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() currencyCode: string;
  @Prop() loading: boolean;
  @Prop() busy: boolean;
  @Prop() label: string;
  @Prop() choiceType: ChoiceType = 'all';

  @State() selectedProducts: Array<Product>;
  @State() selectedPriceIds: Array<string>;
  @State() availablePrices: Array<Price>;

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<Array<LineItemData>>;

  /** Add line items event. */
  @Event() ceAddLineItems: EventEmitter<Array<LineItemData>>;

  /**
   * Maybe automatically add the product if radio type.
   */
  maybeUpdateSelectedPrices(e: any) {
    if (this.choiceType !== 'single') return;
    if (e.target.checked) {
      const firstPriceChoice = getProductChoicePriceByIndex(e.target.value, this.productsChoices, 0);
      this.ceUpdateLineItems.emit([
        {
          price_id: firstPriceChoice.id,
          quantity: firstPriceChoice.quantity,
        },
      ]);
    }
  }

  /**
   * Update selected prices when ce-choice changes
   *
   * @param e
   */
  updateSelectedPrices(e) {
    const choices = getSiblings(e.target);
    const prices = getChoicePrices(this.productsChoices);
    const selectedChoices = Array.from(choices).filter(choice => choice.checked && !choice.disabled);
    const selected = prices
      .filter(price => selectedChoices.find(c => c.value === price.id))
      .map(price => {
        return { price_id: price.id, quantity: price.quantity };
      });
    this.ceUpdateLineItems.emit(selected);
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
    // bail if no products.
    if (Object.keys(this.productsChoices || {})?.length < 2) return;

    // render loading.
    if (this.loading) {
      return this.renderLoading(Object.keys(this.productsChoices || {}).length);
    }

    // bail if no products.
    if (!this.products?.length) {
      return;
    }

    return (
      <ce-choices label={this.label} class="loaded product-selector" style={{ '--columns': this.columns.toString() }}>
        {(this.products || []).map(product => {
          const availablePrices = getAvailablePricesForProduct(product, this.productsChoices);
          if (product.archived) return;
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

  /**
   * Render each price selector.
   */
  renderPriceSelectors() {
    if (this.loading) {
      const firstProduct = this.productsChoices?.[Object.keys(this.productsChoices)[0]];
      const prices = Object.keys(firstProduct.prices).filter(priceId => firstProduct.prices[priceId].enabled);
      return this.renderLoading(prices.length);
    }

    return (this.products || []).map(product => {
      if (!product || !product?.prices) return;
      // only if product is selected
      if (isProductInCheckoutSession(product, this.checkoutSession)) {
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
    const prices = getAvailablePricesForProduct(product, this.productsChoices);
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
    if (!Object.keys(this.productsChoices || {}).length) {
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

openWormhole(CePriceChoices, ['currencyCode', 'products', 'productsChoices', 'checkoutSession', 'loading', 'busy', 'choiceType'], false);
