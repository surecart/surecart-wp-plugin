import { Component, h, Prop, State, Element, Listen, Event, EventEmitter, Watch } from '@stencil/core';
import { LineItem, LineItemData, Product, Price, Checkout } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { state as checkoutState, onChange } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';
import { convertLineItemsToLineItemData } from '../../../../functions/line-items';
@Component({
  tag: 'sc-product-donation-choices',
  styleUrl: 'sc-product-donation-choices.scss',
  shadow: true,
})
export class ScProductDonationChoice {
  private removeCheckoutListener: () => void;

  @Element() el: HTMLScProductDonationChoicesElement;
  /** The product id for the fields. */
  @Prop({ reflect: true }) productId: string;

  /** The price id for the fields. */
  @Prop({ reflect: true }) priceId: string;

  /** The ad_hoc prices of the product selected. */
  @State() prices: Price[];

  /** The selected price of the product. */
  @State() selectedPrice: Price;

  /** The selected product. */
  @Prop() selectedProduct: Product;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  /** Is this loading */
  @Prop() loading: boolean;

  /** Is this busy */
  @Prop() busy: boolean;

  /** The label for the field. */
  @Prop() amountLabel: string;

  /** The label for the recurring fields. */
  @Prop() recurringLabel: string;

  /** The label for the recurring choice field. */
  @Prop() recurringChoiceLabel: string;

  /** The label for the non recurring choice field. */
  @Prop() nonRecurringChoiceLabel: string;

  /** Number of columns for amounts. */
  @Prop() amountColumns: string;

  /** Error */
  @State() error: string;

  /** Amount */
  @State() amount: string;

  /** Toggle line item event */
  @Event() scToggleLineItem: EventEmitter<LineItemData>;

  @Listen('scChange')
  handleChange() {
    let checked = Array.from(this.getChoices()).find(item => {
      return item.checked && item.parentElement.tagName === 'SC-CUSTOM-DONATION-AMOUNT' && this.isInRange(item?.value);
    });

    if (!checked) {
      checked = Array.from(this.getChoices()).find(item => {
        const value = item?.value ? item?.value : null;
        return item.checked && this.isInRange(value);
      });
    }

    if (!checked) {
      checked = Array.from(this.getChoices())?.find(item => this.isInRange(item.value));
    }

    if (checked) {
      checked.checked = true;
      Array.from(this.getChoices()).forEach(item => {
        if (item !== checked) {
          item.checked = false;
        }
      });
    }

    const value = checked?.value ? checked?.value : null;
    this.amount = value;

    if (!isNaN(parseInt(value))) {
      this.addOrUpdateLineItem({
        ...(!!value ? { ad_hoc_amount: parseInt(value) } : {}),
        ...(!!this.priceId ? { price_id: this.priceId } : {}),
        quantity: 1,
      });
    }
  }

  @Watch('selectedPrice')
  priceChanged() {
    this.removeInvalidAmounts();
  }

  @Watch('priceId')
  priceIdChanged() {
    this.selectedPrice = this.prices?.find(price => price.id === this.priceId);
  }

  @Watch('prices')
  pricesChanged() {
    this.selectDefaultChoice();
  }

  lineItemChanged() {
    this.priceId = this.lineItem()?.price?.id;
    this.selectedPrice = this.prices?.find(price => price.id === this.priceId);
    this.amount = this.lineItem()?.ad_hoc_amount?.toString();
  }

  async addOrUpdateLineItem(data: any = {}) {
    // convert line items response to line items post.
    let existingData = convertLineItemsToLineItemData(checkoutState?.checkout?.line_items || []);

    try {
      updateFormState('FETCH');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState?.checkout?.id,
        data: {
          live_mode: true,
          line_items: [
            ...(existingData || []).map((item: LineItemData) => {
              return {
                ...item,
                ...(!!data?.price_id ? { price_id: data?.price_id } : {}),
                ...(!!data?.ad_hoc_amount ? { ad_hoc_amount: data?.ad_hoc_amount } : {}),
                quantity: 1,
              };
            }),
            // add a line item if one does not exist.
            ...(!this.lineItem()
              ? [
                  {
                    price_id: this.priceId,
                    ...(!!data?.ad_hoc_amount ? { ad_hoc_amount: data?.ad_hoc_amount } : {}),
                    quantity: 1,
                  },
                ]
              : []),
          ],
        },
      })) as Checkout;
      updateFormState('RESOLVE');
    } catch (e) {
      console.error(e);
      createErrorNotice(e, { dismissible: true });
      updateFormState('REJECT');
      throw e;
    }
  }

  async addOrUpdateProductPrices() {
    if (!this.productId) return;
    const product = (await apiFetch({
      path: addQueryArgs(`surecart/v1/products/${this.productId}`, {
        expand: ['prices'],
      }),
    })) as Product;
    this.selectedProduct = product;
    this.prices = product?.prices?.data?.sort((a, b) => a?.position - b?.position);
    this.loading = false;
  }

  lineItem() {
    return checkoutState?.checkout?.line_items?.data?.find((item: any) => item?.price?.product?.id === this.productId && item?.price?.ad_hoc) as LineItem;
  }

  handleCheckoutChange() {
    this.lineItemChanged();
  }

  componentWillLoad() {
    if (!this.prices?.length) {
      this.loading = true;
      this.addOrUpdateProductPrices();
    }
    this.removeCheckoutListener = onChange('checkout', () => this.handleCheckoutChange());
  }

  /** Remove listener. */
  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  selectDefaultChoice() {
    // Set Price ID.
    if (!this.prices?.length) return;
    let checkoutPriceID = this.lineItem()?.price?.id;
    this.selectedPrice = checkoutPriceID ? this.prices?.find(price => price.id === checkoutPriceID) : this.prices?.filter(price => price?.recurring_interval && price?.ad_hoc)?.[0];
    this.priceId = this.selectedPrice?.id;

    let choices = Array.from(this.getChoices());
    //only need choices that has a value && is in range of selected price
    choices = choices.filter(choice => choice?.value && this.isInRange(choice?.value));

    let checkoutAmount = this.lineItem()?.ad_hoc_amount;
    let selectedChoice = choices.find((choice: HTMLScChoiceElement) => choice?.value === checkoutAmount?.toString());
    selectedChoice = selectedChoice ? selectedChoice : choices[0];
    if (selectedChoice) {
      selectedChoice.checked = true;
    }

    if (!this.lineItem()) {
      this.addOrUpdateLineItem({
        ...(!!this.priceId ? { price_id: this.priceId } : {}),
        ...(!!selectedChoice?.value ? { ad_hoc_amount: parseInt(selectedChoice?.value) } : {}),
        quantity: 1,
      });
    }
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

  removeInvalidAmounts() {
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
    if (this.loading) {
      return (
        <div class="sc-product-donation-choices">
          <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
        </div>
      );
    }

    const nonRecurringPrice = this.prices?.find(price => !price?.recurring_interval && price?.ad_hoc);
    const recurringPrices = this.prices?.filter(price => price?.recurring_interval && price?.ad_hoc);

    return (
      <div class="sc-product-donation-choices" style={{ '--columns': this.amountColumns }}>
        <sc-choices label={this.amountLabel}>
          <slot />
        </sc-choices>
        <div class="sc-donation-recurring-choices" part="base">
          <sc-choices label={this.recurringLabel} part="choices">
            <sc-recurring-price-choice-container
              label={this.recurringChoiceLabel}
              prices={recurringPrices}
              product={this?.selectedProduct}
              selectedPrice={this.selectedPrice}
              showDetails={false}
              showAmount={false}
              onScChange={e => {
                this.priceId = e.detail;
              }}
            />
            <sc-choice-container
              show-control="false"
              value={nonRecurringPrice?.id}
              checked={this.priceId === nonRecurringPrice?.id}
              part="choice"
              onScChange={() => {
                this.priceId = nonRecurringPrice?.id;
              }}
            >
              <div class="price-choice__title">
                <div class="price-choice__name">{this.nonRecurringChoiceLabel}</div>
              </div>
            </sc-choice-container>
          </sc-choices>
        </div>
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </div>
    );
  }
}
