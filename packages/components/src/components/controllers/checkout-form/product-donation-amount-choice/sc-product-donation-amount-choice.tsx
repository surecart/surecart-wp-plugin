import { Component, h, Prop, Element, Host } from '@stencil/core';
import { LineItem, LineItemData, Checkout } from '../../../../types';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { convertLineItemsToLineItemData } from '../../../../functions/line-items';
import { updateFormState } from '@store/form/mutations';
import { createOrUpdateCheckout } from '../../../../services/session';
import { createErrorNotice } from '@store/notices/mutations';
import { isInRange } from '../../../../functions/util';

@Component({
  tag: 'sc-product-donation-amount-choice',
  styleUrl: 'sc-product-donation-amount-choice.scss',
  shadow: true,
})
export class ScProductDonationAmountChoice {
  @Element() el: HTMLScProductDonationAmountChoiceElement;
  /** The product id for the fields. */
  @Prop({ reflect: true }) productId: string;

  /** The value of the field. */
  @Prop() value: number;

  /** The label for the field. */
  @Prop() label: string;

  /** The currency code for the field. */
  @Prop() currencyCode: string = 'USD';

  /** Is the field checked. */
  @Prop({ reflect: true }) checked: boolean = false;

  /** Is this busy */
  @Prop() busy: boolean;

  lineItem() {
    return checkoutState?.checkout?.line_items?.data?.find((item: any) => item?.price?.product?.id === this.productId && item?.price?.ad_hoc) as LineItem;
  }

  handleChoiceSelect(e) {
    e.stopImmediatePropagation();
    if (!e?.detail) return;
    this.addOrUpdateLineItem({
      ...(!!this.value ? { ad_hoc_amount: this.value } : {}),
    });
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
              if (item?.price_id === this.lineItem()?.price?.id) {
                return {
                  ...item,
                  ...(!!data?.ad_hoc_amount ? { ad_hoc_amount: data?.ad_hoc_amount } : {}),
                  quantity: 1,
                };
              }
              return {
                ...item,
              };
            }),
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

  render() {
    if (!isInRange(this.value, this.lineItem()?.price)) return <Host style={{ display: 'none' }}></Host>;

    return (
      <sc-choice-container show-control="false" value={`${this.value}`} checked={this.value === this.lineItem()?.ad_hoc_amount} onScChange={this.handleChoiceSelect.bind(this)}>
        {this.label ? this.label : <sc-format-number type="currency" currency={this.currencyCode} value={this.value} minimum-fraction-digits="0"></sc-format-number>}
        {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
      </sc-choice-container>
    );
  }
}
