import { Component, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';
import { LineItem, LineItemData, Price } from '../../../../types';
import apiFetch from '../../../../functions/fetch';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-custom-order-price-input',
  styleUrl: 'sc-custom-order-price-input.css',
  shadow: false,
})
export class ScCustomOrderPriceInput {
  /** Id of the price. */
  @Prop({ reflect: true }) priceId: string;

  /** Stores the price */
  @Prop({ mutable: true }) price: Price;

  /** Is this loading */
  @Prop() loading: boolean = false;

  /** Is this busy */
  @Prop() busy: boolean = false;

  /** Label for the field. */
  @Prop() label: string;

  /** Input placeholder. */
  @Prop() placeholder: string;

  /** Is this required? */
  @Prop() required: boolean;

  /** Help text. */
  @Prop() help: string;

  /** Show the currency code? */
  @Prop({ reflect: true }) showCode: boolean;

  /** Label for the choice. */
  @Prop() lineItems: LineItem[] = [];

  /** Internal fetching state. */
  @State() fetching: boolean = false;

  /** Holds the line item for this component. */
  @State() lineItem: LineItem;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  @Listen('scBlur')
  handleBlur(e) {
    const ad_hoc_amount = parseInt(e.target.value);
    if (isNaN(ad_hoc_amount)) return;
    if (this.lineItem?.ad_hoc_amount === ad_hoc_amount) return;

    this.scUpdateLineItem.emit({ price_id: this.priceId, quantity: 1, ad_hoc_amount });
  }

  /** Store current line item in state. */
  @Watch('lineItems')
  handleLineItemsChange() {
    if (!this.lineItems?.length) return;
    this.lineItem = (this.lineItems || []).find(lineItem => lineItem.price.id === this.priceId);
  }

  componentDidLoad() {
    if (!this.price) {
      this.fetchPrice();
    }
  }

  /** Fetch prices and products */
  async fetchPrice() {
    if (!this.priceId) return;
    try {
      this.fetching = true;
      this.price = (await apiFetch({
        path: `surecart/v1/prices/${this.priceId}`,
      })) as Price;
    } catch (err) {
    } finally {
      this.fetching = false;
    }
  }

  render() {
    if (this.loading || this.fetching) {
      return (
        <div>
          <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '100%' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <div class="sc-custom-order-price-input">
        <sc-price-input
          currency-code={this.price?.currency || 'usd'}
          label={this.label}
          min={this?.price?.ad_hoc_min_amount}
          max={this?.price?.ad_hoc_max_amount}
          placeholder={this.placeholder}
          required={this.required}
          value={this.lineItem?.ad_hoc_amount.toString()}
          show-code={this.showCode}
          help={this.help}
        ></sc-price-input>

        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}

openWormhole(ScCustomOrderPriceInput, ['busy', 'lineItems'], false);
