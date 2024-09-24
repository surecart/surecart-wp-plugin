import { Component, h, Prop, Element, Host } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { isInRange } from '../../../../functions/util';
import { state as donationState } from '@store/product-donation';
import { updateDonationState as update } from '@store/product-donation/mutations';
import { getInRangeAmounts } from '@store/product-donation/getters';

@Component({
  tag: 'sc-product-donation-amount-choice',
  styleUrl: 'sc-product-donation-amount-choice.scss',
})
export class ScProductDonationAmountChoice {
  @Element() el: HTMLScProductDonationAmountChoiceElement;
  /** The product id for the fields. */
  @Prop({ reflect: true }) productId: string;

  /** The value of the field. */
  @Prop() value: number;

  /** The label for the field. */
  @Prop() label: string;

  state() {
    return donationState[this.productId];
  }

  render() {
    const amounts = getInRangeAmounts(this.productId);
    const order = amounts.indexOf(this.value);
    if (!isInRange(this.value, this.state().selectedPrice) || order < 0) return <Host style={{ display: 'none' }}></Host>;
    return (
      <sc-choice-container
        show-control="false"
        checked={this.state().ad_hoc_amount === this.value}
        onScChange={() => update(this.productId, { ad_hoc_amount: this.value, custom_amount: null })}
        // translators: Amount Choice - Amount Number Amount Total
        aria-label={sprintf(__('%d of %d', 'surecart'), order + 1, amounts.length)}
        role="button"
      >
        {this.label ? (
          this.label
        ) : (
          <sc-format-number type="currency" currency={this.state().selectedPrice?.currency} value={this.value} minimum-fraction-digits="0"></sc-format-number>
        )}
      </sc-choice-container>
    );
  }
}
