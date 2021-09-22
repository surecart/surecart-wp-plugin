import { Component, h, Prop, Element, Watch, Event, EventEmitter, State } from '@stencil/core';
import { Product, LineItemData, ProductChoices } from '../../../types';
import { getProducts } from '../../../services/fetch';
import { getFormattedPrice } from '../../../functions/price';
import { openWormhole } from 'stencil-wormhole';

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
  @Prop() lineItemData: Array<LineItemData>;
  @Prop() currencyCode: string;

  @State() loading: boolean;
  @State() products: Array<Product>;
  @State() selectedProducts: Array<Product>;

  /** Update line items event. */
  @Event() ceUpdateLineItems: EventEmitter<Array<LineItemData>>;

  @Watch('products')
  handleDefaultProductSelection() {
    if (!this.products) return;
    this.selectedProducts = [this.products[0]];
  }

  /** Watch choices and fetch if changed */
  @Watch('choices')
  async fetchProducts() {
    this.loading = true;
    try {
      this.products = await getProducts({
        query: {
          active: true,
          ids: Object.keys(this.choices),
        },
      });
    } finally {
      this.loading = false;
    }
  }

  /** Maybe fetch products on load */
  componentWillLoad() {
    if (this.choices) {
      this.fetchProducts();
    }
  }

  updateSelected() {
    const choices = this.el.querySelectorAll('ce-choice');

    // get selected choices
    const selected = Array.from(choices).filter(choice => {
      return choice.name && choice.checked && !choice.disabled;
    });

    this.selectedProducts = selected.map(item => this.products.find(product => product.id === item.value)).filter(n => n);

    console.log(this.selectedProducts);
    // // convert to line item data
    // const data = (selected || []).map(item => {
    //   return { price_id: item.value, quantity: 1 } as LineItemData;
    // });

    // emit update event
    // this.ceUpdateLineItems.emit(data);
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

    if (this.loading) {
      return this.renderLoading(length);
    }

    if (this.products?.length <= 1) {
      return;
    }

    return (
      <ce-choices class="loaded" style={{ '--columns': this.columns.toString() }}>
        {this.products.map(product => {
          return (
            <ce-choice
              class="loaded"
              onCeChange={() => this.updateSelected()}
              name={'product'}
              value={product.id}
              type={this.type}
              checked={this.selectedProducts.some(selected => selected.id === product.id)}
            >
              {product.name}
              <span slot="description">{product.description}</span>
            </ce-choice>
          );
        })}
      </ce-choices>
    );
  }

  renderPriceSelectors() {
    if (!this?.selectedProducts?.length) {
      return;
    }

    // render each price selector
    return this.selectedProducts.map(product => {
      if (!product?.prices) return;
      return this.renderPriceSelector(product);
    });
  }

  renderPriceSelector(product: Product) {
    if (this.loading && !!this.choices?.[0]?.prices?.length) {
      return this.renderLoading(this.choices[0].prices.length);
    }

    if (!product?.prices) return;
    const prices = product.prices;

    return (
      <ce-form-row>
        <ce-choices label={product.name} class="loaded" style={{ '--columns': this.columns.toString() }}>
          {prices.map(price => {
            return (
              <ce-choice class="loaded" onCeChange={() => {}} name={'price'} value={price.id} type={this.type}>
                {price.name}
                <span slot="price">{getFormattedPrice({ amount: price.amount, currency: price.currency })}</span>
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
      <div>
        {this.renderProductSelector()}
        {this.renderPriceSelectors()}
      </div>
    );
  }
}

openWormhole(CePriceChoices, ['currencyCode', 'choices'], false);
