import { Component, h, Prop, Element, Host } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { createOrUpdateCheckout } from '../../../../services/session';
import { Checkout, LineItem, LineItemData } from '../../../../types';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';
import { convertLineItemsToLineItemData } from '../../../../functions/line-items';
@Component({
  tag: 'sc-product-donation-custom-amount',
  styleUrl: 'sc-product-donation-custom-amount.scss',
})
export class ScProductDonationCustomAmount {
  private removeCheckoutListener: () => void;

  @Element() el: HTMLScProductDonationCustomAmountElement;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

  /** Selected Product Id for the donation. */
  @Prop() productId: string;

  /** Custom Amount of the donation. */
  @Prop() value: string;

  /** Remove listener. */
  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  lineItem() {
    return checkoutState?.checkout?.line_items?.data?.find((item: any) => item?.price?.product?.id === this.productId && item?.price?.ad_hoc) as LineItem;
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
                    price_id: this.lineItem()?.price?.id,
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

  async handleButtonClick(e) {
    e.stopImmediatePropagation();
    if (!this.lineItem()?.price?.id || !this.value) return;
    this.addOrUpdateLineItem({
      ad_hoc_amount: parseInt(this.value),
      price_id: this.lineItem()?.price?.id,
      quantity: 1,
    });
  }

  handlePriceChange(e) {
    this.value = e?.target?.value;
  }

  render() {
    return (
      <Host class={{ 'sc-product-donation-custom-amount': true, 'sc-product-donation-custom-amount--has-value': !!this.value?.length }}>
        <sc-choice-container value={this.value} show-control="false">
          <sc-form onScFormSubmit={e => this.handleButtonClick(e)}>
            <sc-price-input
              currencyCode={this.currencyCode}
              showCode={false}
              showLabel={false}
              onScInput={e => this.handlePriceChange(e)}
              min={this.lineItem()?.price?.ad_hoc_min_amount}
              max={this.lineItem()?.price?.ad_hoc_max_amount}
              style={{ '--sc-input-border-color-focus': 'var(--sc-input-border-color-hover)', '--sc-focus-ring-color-primary': 'transparent' }}
            >
              <sc-button circle submit slot="suffix" size="small" type="primary">
                <sc-icon name="arrow-right" />
              </sc-button>
            </sc-price-input>
          </sc-form>
        </sc-choice-container>
      </Host>
    );
  }
}
