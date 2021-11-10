import { Component, h, Prop, Event, EventEmitter, Watch, State, Fragment } from '@stencil/core';
import { isPriceInCheckoutSession } from '../../../functions/line-items';
import { openWormhole } from 'stencil-wormhole';
import { getPricesAndProducts } from '../../../services/fetch';
import { CheckoutSession, LineItemData, PriceChoice, Prices, Products } from '../../../types';

@Component({
  tag: 'ce-price-selector',
  styleUrl: 'ce-price-selector.css',
  shadow: true,
})
export class CePriceSelector {
  choicesRef: HTMLCeChoicesElement;

  /** Selector label */
  @Prop() label: string;

  /** Number of columns */
  @Prop() columns: number = 1;

  /** Choices to choose from */
  @Prop({ reflect: true }) choices: Array<PriceChoice>;

  /** Choice Type */
  @Prop({ reflect: true }) type: 'checkbox' | 'radio';

  /** The default choice. */
  @Prop({ reflect: true }) defaultChoice: { id: string; quantity: number } = { id: '', quantity: 1 };

  /** Price entities */
  @Prop() prices: Prices;

  /** Product entity */
  @Prop() products: Products;

  /** The current checkout session. */
  @Prop() checkoutSession: CheckoutSession;

  /** Busy */
  @Prop() busy: boolean = false;

  /** Toggle line item event */
  @Event() ceToggleLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceUpdateLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Add entities */
  @Event() ceAddEntities: EventEmitter<any>;

  /** Loading */
  @State() loading: boolean = false;

  /** Handle choices change */
  @Watch('choices')
  async handleChoicesChange() {
    this.fetchPricesAndProducts();
  }

  /** Fetch prices and products */
  async fetchPricesAndProducts() {
    const ids = (this.choices || []).filter(choice => choice.enabled).map(choice => choice.id);
    if (!ids?.length) return;
    try {
      this.loading = true;
      const { products, prices } = await getPricesAndProducts({
        active: true,
        ids,
      });
      // add to central store.
      this.ceAddEntities.emit({ prices, products });
    } catch (err) {
    } finally {
      this.loading = false;
    }
  }

  /** Fetch prices and products on load. */
  componentWillLoad() {
    this.type = this.choices.length > 2 ? this.type : 'checkbox';
    this.fetchPricesAndProducts();
  }

  productName(price) {
    // only show product name if there is only one product.
    if (this.choices.length !== 1) return;
    return this?.products?.[price?.product]?.name;
  }

  render() {
    if (this.loading) {
      return (
        <ce-choices label={this.label ? <ce-skeleton style={{ width: '120px', display: 'inline-block' }}></ce-skeleton> : ''} style={{ '--columns': this.columns.toString() }}>
          {this.choices.map((_, index) => {
            return (
              <ce-choice name="loading" key={index} disabled>
                <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
                <ce-skeleton style={{ width: '20px', display: 'inline-block' }} slot="price"></ce-skeleton>
              </ce-choice>
            );
          })}
        </ce-choices>
      );
    }

    return (
      <Fragment>
        <ce-choices ref={el => (this.choicesRef = el)} label={this.label} class="loaded price-selector" style={{ '--columns': this.columns.toString() }}>
          {this.choices.map(choice => {
            const price = this.prices?.[choice?.id];
            if (!price || price.archived) return;

            const productName = this.productName(price);

            return (
              <ce-choice
                class="loaded"
                value={price.id}
                type={this.type}
                onCeChange={e => {
                  const checked = e.detail;
                  const inSession = isPriceInCheckoutSession(price, this.checkoutSession);
                  console.log(inSession, this.checkoutSession);
                  // if checked and not yet in session
                  if (!inSession && checked) {
                    this.ceUpdateLineItem.emit({ price_id: choice.id, quantity: choice.quantity });
                    return;
                  }
                  // if in session and not checked
                  if (inSession && !checked) {
                    this.ceRemoveLineItem.emit({ price_id: choice.id, quantity: choice.quantity });
                    return;
                  }
                }}
                checked={isPriceInCheckoutSession(price, this.checkoutSession)}
              >
                {productName ? productName : price.name}
                <span slot="price">
                  <ce-format-number type="currency" value={price.amount} currency={price.currency}></ce-format-number>
                </span>
                <span slot="per">{price.recurring_interval ? `/ ${price.recurring_interval}` : `once`}</span>
              </ce-choice>
            );
          })}
        </ce-choices>
        {this.busy && <ce-block-ui transparent z-index={4}></ce-block-ui>}
      </Fragment>
    );
  }
}

openWormhole(CePriceSelector, ['prices', 'products', 'busy', 'checkoutSession']);
