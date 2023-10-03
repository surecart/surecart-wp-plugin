import { Component, h, Prop, State, Element, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { LineItem, LineItemData, Product, Price, Checkout } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { state as checkoutState, onChange } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
import { createErrorNotice } from '@store/notices/mutations';
@Component({
  tag: 'sc-product-donation-choices',
  styleUrl: 'sc-product-donation-choices.scss',
  shadow: true,
})
export class ScProductDonationChoice {
  private removeCheckoutListener: () => void;

  @Element() el: HTMLScProductDonationChoicesElement;
  /** The product id for the fields. */
  @Prop({ reflect: true }) product: string;

  /** The price id for the fields. */
  @Prop({ reflect: true }) priceId: string;

  @State() prices: Price[];

  @State() selectedPrice: Price;

  @Prop() selectedProduct: Product;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  /** Order line items. */
  @Prop() lineItem: LineItem;

  /** Is this loading */
  @Prop() loading: boolean;
  @Prop() busy: boolean;

  /** The label for the field. */
  @Prop() amountLabel: string;

  /** The label for the field. */
  @Prop() recurringLabel: string;

  @Prop() recurringChoiceLabel: string;

  @Prop() nonRecurringChoiceLabel: string;

  /** The label for the field. */
  @Prop() amountColumns: string;

  /** Error */
  @State() error: string;

  /** Toggle line item event */
  @Event() scToggleLineItem: EventEmitter<LineItemData>;

  @Listen('scChange')
  handleChange() {
    let checked = Array.from(this.getChoices()).find(item => {
      return item.checked && item.parentElement.tagName === 'SC-CUSTOM-DONATION-AMOUNT';
    });

    if (checked) {
      Array.from(this.getChoices()).forEach(item => {
        if (item !== checked) {
          item.checked = false;
        }
      });
    }

    if (!checked) {
      checked = Array.from(this.getChoices()).find(item => {
        const value = item?.value ? item?.value : null;
        return item.checked && this.isInRange(value);
      });
    }

    if (!checked) {
      checked = Array.from(this.getChoices())?.find(item => this.isInRange(item.value));
      checked.checked = true;
    }

    const value = checked?.value ? checked?.value : null;

    if (!isNaN(parseInt(value)) && this.isInRange(value)) {
      let lineItems = [];
      if (this.lineItem) {
        lineItems = [{ id: this.lineItem?.id, price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(value) }];
      }
      lineItems = [{ price_id: this.priceId, quantity: 1, ad_hoc_amount: parseInt(value) }];
      this.update({ line_items: lineItems });
    }
  }

  @Watch('priceId')
  pricesChanged() {
    this.selectedPrice = this.prices?.find(price => price.id === this.priceId);
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
      createErrorNotice(e, { dismissible: true });
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
    this.lineItem = checkoutState.checkout?.line_items?.data?.[0];
  }

  componentWillLoad() {
    this.lineItem = checkoutState?.checkout?.line_items?.data?.[0];
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
    let choices = Array.from(this.getChoices());
    //only need choices that has a value
    choices = choices.filter(choice => choice?.value);
    if (!choices.length || !this.prices?.length) return;
    let checkoutPriceID = this.lineItem?.price?.id;
    let checkoutAmount = this.lineItem?.ad_hoc_amount;
    const selectedChoice = choices.find((choice: HTMLScChoiceElement) => choice?.value === checkoutAmount?.toString());
    if (selectedChoice) {
      selectedChoice.checked = true;
    } else {
      choices[0].checked = true;
    }
    this.priceId = checkoutPriceID || this.prices?.filter(price => price?.recurring_interval && price?.ad_hoc)?.[0]?.id;
    this.handleChange();
  }

  getChoices() {
    return (this.el.querySelectorAll('sc-choice-container' || 'sc-custom-donation-amount sc-choice-container') as NodeListOf<HTMLScChoiceElement>) || [];
  }

  isInRange(value: string) {
    const valueInt = parseInt(value);
    if (!this.selectedPrice) return true;
    if (this.selectedPrice?.ad_hoc_max_amount && valueInt > this.selectedPrice?.ad_hoc_max_amount) return false;
    if (this.selectedPrice?.ad_hoc_min_amount && valueInt < this.selectedPrice?.ad_hoc_min_amount) return false;
    return true;
  }

  removeInvalidPrices() {
    if (!this.selectedPrice) return;

    this.getChoices().forEach((el: HTMLScChoiceElement) => {
      if (!this.isInRange(el.value) && el.parentElement.tagName !== 'SC-CUSTOM-DONATION-AMOUNT') {
        el.style.display = 'none';
        el.disabled = true;
        return;
      }
      el.style.display = 'flex';
      el.disabled = false;
    });
  }

  render() {
    const nonRecurringPrice = this.prices?.find(price => !price?.recurring_interval && price?.ad_hoc);

    if (this.loading) {
      return (
        <div class="sc-product-donation-choices">
          <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <div class="sc-product-donation-choices" style={{ '--columns': this.amountColumns }}>
        <sc-choices label={this.amountLabel}>
          <slot />
        </sc-choices>
        <sc-donation-recurring-choices
          label={this.recurringLabel}
          recurringChoiceLabel={this.recurringChoiceLabel}
          nonRecurringChoiceLabel={this.nonRecurringChoiceLabel}
          prices={this.prices}
          priceId={this.priceId}
          onScChange={e => {
            if ('string' === typeof e?.detail) {
              this.priceId = e.detail;
            } else if (true === e?.detail) {
              this.priceId = nonRecurringPrice?.id;
            }
            this.handleChange();
          }}
          part="recurring-choices"
        />
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}
