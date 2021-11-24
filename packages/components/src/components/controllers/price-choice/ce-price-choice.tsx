import { Component, h, Prop, Event, EventEmitter, Watch, Fragment, State } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { isPriceInCheckoutSession } from '../../../functions/line-items';
import { translatedInterval } from '../../../functions/price';
import { getPricesAndProducts } from '../../../services/fetch';
import { CheckoutSession, LineItemData, Price, Prices, Products, ResponseError } from '../../../types';

@Component({
  tag: 'ce-price-choice',
  styleUrl: 'ce-price-choice.css',
  shadow: false,
})
export class CePriceChoice {
  private adHocInput: HTMLCePriceInputElement;

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
  @Prop() checkoutSession: CheckoutSession;

  /** Default quantity */
  @Prop() quantity: number = 1;

  /** Choice Type */
  @Prop() type: 'checkbox' | 'radio';

  /** Is this checked by default */
  @Prop({ reflect: true, mutable: true }) checked: boolean = false;

  /** Errors from response */
  @Prop() error: ResponseError;

  /** Toggle line item event */
  @Event() ceUpdateLineItem: EventEmitter<LineItemData>;

  /** Toggle line item event */
  @Event() ceRemoveLineItem: EventEmitter<LineItemData>;

  /** Add entities */
  @Event() ceAddEntities: EventEmitter<any>;

  /** Stores the error message */
  @State() errorMessage: string;

  /** Stores the error message */
  @State() adHocErrorMessage: string;

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

  @Watch('error')
  handleErrorsChange() {
    const error = (this?.error?.additional_errors || []).find(error => error?.data?.attribute === 'line_items.ad_hoc_amount');
    this.adHocErrorMessage = error?.message ? error?.message : '';
  }

  @Watch('checkoutSession')
  handleCheckoutSessionChange() {
    if (this.isInCheckoutSession()) {
      this.checked = true;
    }
  }

  @Watch('checked')
  handleCheckedChange() {
    const inSession = this.isInCheckoutSession();

    // if in session and not checked
    if (inSession && !this.checked) {
      this.ceRemoveLineItem.emit({ price_id: this.priceId, quantity: this.quantity });
      return;
    }

    if (this.price?.ad_hoc) {
      setTimeout(() => {
        this.adHocInput.triggerFocus();
      }, 50);
      return;
    }

    // if checked and not yet in session
    if (!inSession && this.checked) {
      this.ceUpdateLineItem.emit({ price_id: this.priceId, quantity: this.quantity });
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
    this.checked = checked;

    // const inSession = this.isInCheckoutSession();

    // // if in session and not checked
    // if (inSession && !checked) {
    //   this.ceRemoveLineItem.emit({ price_id: this.priceId, quantity: this.quantity });
    //   return;
    // }

    // if (this.price?.ad_hoc) {
    //   setTimeout(() => {
    //     this.adHocInput.triggerFocus();
    //   }, 50);
    //   return;
    // }

    // // if checked and not yet in session
    // if (!inSession && checked) {
    //   this.ceUpdateLineItem.emit({ price_id: this.priceId, quantity: this.quantity });
    //   return;
    // }
  }

  /** Is this price in the checkout session. */
  isInCheckoutSession() {
    return isPriceInCheckoutSession(this.price, this.checkoutSession);
  }

  /** Is this checked */
  isChecked() {
    return this.isInCheckoutSession();
  }

  onChangeAdHoc(e) {
    this.ceUpdateLineItem.emit({ price_id: this.priceId, quantity: this.quantity, ad_hoc_amount: e.target.value });
  }

  getLineItem() {
    return (this.checkoutSession?.line_items?.data || []).find(lineItem => lineItem.price.id === this.priceId);
  }

  renderAdHoc() {
    return (
      <ce-price-input
        ref={el => (this.adHocInput = el as HTMLCePriceInputElement)}
        required
        label={'Enter an amount'}
        value={this.getLineItem()?.ad_hoc_amount.toString()}
        onCeChange={e => this.onChangeAdHoc(e)}
        min={this.price.ad_hoc_min_amount}
        max={this.price.ad_hoc_max_amount}
      ></ce-price-input>
    );
  }

  renderPrice() {
    if (this.price?.ad_hoc) {
      return <span slot="per">Name your price</span>;
    }
    return (
      <Fragment>
        <span slot="price">
          <ce-format-number type="currency" value={this.price.amount} currency={this.price.currency}></ce-format-number>
        </span>
        <span slot="per">{translatedInterval(this.price.recurring_interval_count, this.price.recurring_interval, '/', '')}</span>
      </Fragment>
    );
  }

  render() {
    if (this.loading) {
      return (
        <ce-choice name="loading" showLabel={this.showLabel} showPrice={this.showPrice} showControl={this.showControl} disabled>
          <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></ce-skeleton>
          {this.description && <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></ce-skeleton>}
        </ce-choice>
      );
    }

    // we need an active price.
    if (!this?.price?.id || this.price?.archived) return null;

    return (
      <Fragment>
        <ce-choice
          value={this.priceId}
          type={this.type}
          showLabel={this.showLabel}
          showPrice={this.showPrice}
          showControl={this.showControl}
          checked={this.isChecked()}
          onCeChange={e => {
            this.handleChange(e.detail as boolean);
          }}
        >
          {this.label || this.price.name}
          {this.description && <span slot="description">{this.description}</span>}
          {this.renderPrice()}
        </ce-choice>
        {this.price.ad_hoc &&
          this.checked &&
          (this.adHocErrorMessage ? (
            <ce-tooltip text={this.adHocErrorMessage} type="danger" padding={10} freeze open onClick={() => (this.adHocErrorMessage = '')}>
              {this.renderAdHoc()}
            </ce-tooltip>
          ) : (
            this.renderAdHoc()
          ))}
      </Fragment>
    );
  }
}

openWormhole(CePriceChoice, ['prices', 'products', 'checkoutSession', 'error'], false);
