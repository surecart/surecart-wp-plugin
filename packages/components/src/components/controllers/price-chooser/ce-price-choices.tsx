import { Component, h, Prop, Element, Event, EventEmitter, State } from '@stencil/core';
import { Product, Price, LineItemData, ProductChoices, CheckoutSession, CheckoutState } from '../../../types';
import { getAvailablePricesForProduct, getSiblings, isProductSelected, isPriceSelected } from './functions';
import { openWormhole } from 'stencil-wormhole';
import { getProductsFirstPriceId } from '../../../functions/line-items';

@Component({
  tag: 'ce-price-choices',
  styleUrl: 'ce-price-choices.css',
  shadow: false,
})
export class CePriceChoices {
  @Element() el: HTMLCePriceChoicesElement;

  @Prop() default: string;
  @Prop() type: 'radio' | 'checkbox' = 'radio';
  @Prop() choices: ProductChoices;
  @Prop() columns: number = 1;
  @Prop() checkoutSession: CheckoutSession;
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() currencyCode: string;
  @Prop() products: Array<Product>;
  @Prop() state: CheckoutState;
  @Prop() label: string;

  @State() selectedProducts: Array<Product>;
  @State() selectedPriceIds: Array<string>;
  @State() availablePrices: Array<Price>;

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<Array<LineItemData>>;

  /** Add line items event. */
  @Event() ceAddLineItems: EventEmitter<Array<LineItemData>>;

  // @Watch('selectedProducts')
  // handlePriceSelection(_, oldVal) {
  //   if (!oldVal) {
  //     return;
  //   }
  //   if (this?.selectedProducts?.[0]?.id) {
  //     this.selectedPriceIds = [this.choices[this.selectedProducts?.[0]?.id].prices?.[0]];
  //   }
  // }

  /**
   * Maybe automatically add the product if radio type.
   */
  maybeUpdateSelectedPrices(e: any) {
    if (this.type !== 'radio') return;
    if (e.target.checked) {
      const firstPriceChoice = getProductsFirstPriceId(e.target.value, this.choices);
      this.ceUpdateLineItems.emit([
        {
          price_id: firstPriceChoice,
          quantity: 1,
        },
      ]);
    }
  }

  updateSelectedPrices(e) {
    const choices = getSiblings(e.target);
    const selected = Array.from(choices)
      .filter(choice => {
        return choice.checked && !choice.disabled;
      })
      .map(item => {
        return {
          price_id: item.value,
          quantity: 1,
        } as LineItemData;
      });

    this.ceUpdateLineItems.emit(selected);
  }

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
    const length = Object.keys(this.choices || {}).length;
    if (length <= 1) {
      return;
    }

    if (this.state === 'loading') {
      return this.renderLoading(length);
    }

    if (!this.products || this.products?.length <= 1) {
      return;
    }

    return (
      <ce-choices label={this.label} class="loaded product-selector" style={{ '--columns': this.columns.toString() }}>
        {this.products.map(product => {
          const availablePrices = getAvailablePricesForProduct(product, this.choices);
          return (
            <ce-choice
              class="loaded"
              value={product.id}
              type={this.type}
              onCeChange={e => this.maybeUpdateSelectedPrices(e)}
              checked={isProductSelected(product, this.checkoutSession)}
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
    return (this.products || []).map(product => {
      if (!product || !product?.prices) return;
      // only if product is selected
      if (isProductSelected(product, this.checkoutSession)) {
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
    const prices = getAvailablePricesForProduct(product, this.choices);
    if (!prices || prices?.length < 2) return;

    if (this.state === 'loading') {
      return this.renderLoading(prices?.length);
    }

    let label = 'Choose';
    if (this.type === 'checkbox') {
      label = label + ' ' + product.name;
    }

    return (
      <ce-form-row>
        <ce-choices label={label} class="loaded" style={{ '--columns': this.columns.toString() }}>
          {prices.map(price => {
            return (
              <ce-choice class="loaded" value={price.id} type={this.type} onCeChange={e => this.updateSelectedPrices(e)} checked={isPriceSelected(price, this.checkoutSession)}>
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
    return (
      <div class="price-choices">
        {this.renderProductSelector()}
        {this.renderPriceSelectors()}
        {this.state === 'updating' && <ce-block-ui z-index={2}></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CePriceChoices, ['currencyCode', 'choices', 'products', 'checkoutSession', 'state'], false);
