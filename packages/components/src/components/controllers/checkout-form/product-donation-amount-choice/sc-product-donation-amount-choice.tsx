import { Component, h, Prop, Element, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { isInRange } from '../../../../functions/util';
import { state as donationState } from '@store/product-donation';

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

  /** The currency code for the field. */
  @Prop() currencyCode: string = 'USD';

  state() {
    return donationState[this.productId];
  }

  updateState(data) {
    donationState[this.productId] = {
      ...donationState[this.productId],
      ...data,
    };
  }

  render() {
    if (!isInRange(this.value, this.state().selectedPrice)) return <Host style={{ display: 'none' }}></Host>;
    return (
      <sc-choice-container
        show-control="false"
        checked={this.state().ad_hoc_amount === this.value}
        onScChange={() => this.updateState({ ad_hoc_amount: this.value, custom_amount: null })}
      >
        {this.label ? this.label : <sc-format-number type="currency" currency={this.currencyCode} value={this.value} minimum-fraction-digits="0"></sc-format-number>}
      </sc-choice-container>
    );
  }
}
