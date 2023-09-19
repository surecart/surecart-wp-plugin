import { Component, h, Prop, State, Element, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { LineItem, LineItemData, Product, Price, Checkout } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { state as checkoutState, onChange } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
@Component({
  tag: 'sc-donation-choices-new',
  styleUrl: 'sc-donation-choices-new.scss',
  shadow: true,
})
export class ScDonationChoicesNew {
  private removeCheckoutListener: () => void;

  @Element() el: HTMLScDonationChoicesNewElement;
  /** The product id for the fields. */
  @Prop({ reflect: true }) product: string;

  /** The price id for the fields. */
  @Prop({ reflect: true }) priceId: string;

  @State() prices: Price[];

  @Prop() selectedProduct: Product;

  /** The default amount to load the page with. */
  @Prop() defaultAmount: string;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  /** Order line items. */
  @Prop() lineItem: LineItem;

  /** Is this loading */
  @Prop() loading: boolean;
  @Prop() busy: boolean;

  /** The label for the field. */
  @Prop() amountlabel: string;

  /** The label for the field. */
  @Prop() recurringlabel: string;

  /** The label for the field. */
  @Prop() amountcolumns: number;

  /** Error */
  @State() error: string;

  /** Toggle line item event */
  @Event() scToggleLineItem: EventEmitter<LineItemData>;

  @Listen('scChange')
  handleChange() {
    const checked = Array.from(this.getChoices()).find(item => item.checked);
    if (!checked) return;
    if (!isNaN(parseInt(checked.value))) {
      let lineItems = [];
      if (this.lineItem) {
        lineItems = [{ id: this.lineItem?.id, price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(checked.value) }];
      }
      lineItems = [{ price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(checked.value) }];
      this.update({ line_items: lineItems });
    }
  }

  @Watch('priceId')
  pricesChanged() {
    this.removeInvalidPrices();
  }

   /** Update a session */
   async update(data: any = {}, query = {}) {
    try {
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout?.id,
        data,
        query,
      })) as Checkout;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  
  async getProductPrices() {  
    if (!this.product) return; 
    const product = (await apiFetch({
      path: addQueryArgs(`surecart/v1/products/${this.product}`, {
        expand: ['prices'],
      }),
    })) as Product;
    this.selectedProduct = product;
    this.prices = product?.prices?.data?.sort((a, b) => a?.position - b?.position); 
    this.loading = false;
    this.selectDefaultChoice();
    this.removeInvalidPrices();
  }
  handleCheckoutChange() {
    if (this.lineItem) return;
    console.log(checkoutState.checkout?.line_items?.data?.[0]);
    
    this.lineItem = checkoutState.checkout?.line_items?.data?.[0];
  }
  componentWillLoad() {
    if (!this.prices?.length) {
      this.loading = true;
      this.getProductPrices();
    }
    this.removeCheckoutListener = onChange('checkout', () => this.handleCheckoutChange());
  }

  /** Remove listener. */
  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  selectDefaultChoice() {
    const choices = this.getChoices();
    if (!choices.length || !this.prices?.length) return;
    choices[0].checked = true;
    this.priceId = this.prices?.filter(price => price?.recurring_interval && price?.ad_hoc)?.[0]?.id;
    this.handleChange();
  }

  getChoices() {
    return (this.el.querySelectorAll('sc-choice') as NodeListOf<HTMLScChoiceElement>) || [];
  }

  removeInvalidPrices() {
   const selectedPrice = this.prices?.find(price => price.id === this.priceId);

    this.getChoices().forEach((el: HTMLScChoiceElement) => {
      // we have a max and the value is more.
      if (selectedPrice?.ad_hoc_max_amount && parseInt(el.value) > selectedPrice?.ad_hoc_max_amount) {
        el.style.display = 'none';
        el.disabled = true;
        return;
      }

      // we have a min and the value is less.
      if (selectedPrice?.ad_hoc_min_amount && parseInt(el.value) < selectedPrice?.ad_hoc_min_amount) {
        el.style.display = 'none';
        el.disabled = true;
        return;
      }

      el.style.display = 'flex';
      el.disabled = false;
    });
  }

  render() {
    console.log(checkoutState.checkout);
    
    const nonRecurringPrice = this.prices?.find(price => !price?.recurring_interval && price?.ad_hoc);
    
    if (this.loading) {
      return (
        <div class="sc-donation-choices-new">
          <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <div class="sc-donation-choices-new">
        <sc-choices label={this.amountlabel}>
          <slot />
        </sc-choices>
        <sc-donation-recurring-choices-new
          label={this.recurringlabel}
          prices={this.prices}
          priceId={this.priceId}
          onScChange={e => {
            if ('string' === typeof e?.detail) {
              this.priceId = e.detail;
            } else if ( true === e?.detail ) {
              this.priceId = nonRecurringPrice?.id;
            }
            this.handleChange();
          }}
        />
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}
