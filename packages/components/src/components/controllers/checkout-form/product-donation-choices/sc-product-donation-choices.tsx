import { Component, h, Prop, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as donationState } from '@store/product-donation';

@Component({
  tag: 'sc-product-donation-choices',
  styleUrl: 'sc-product-donation-choices.scss',
  shadow: true,
})
export class ScProductDonationChoice {
  @Element() el: HTMLScProductDonationChoicesElement;

  /** The product id for the fields. */
  @Prop({ reflect: true }) productId: string;

  /** The label for the field. */
  @Prop() label: string;

  /** The label for the recurring fields. */
  @Prop() recurringLabel: string;

  /** The label for the recurring choice field. */
  @Prop() recurringChoiceLabel: string;

  /** The label for the non recurring choice field. */
  @Prop() nonRecurringChoiceLabel: string;

  /** Number of columns for amounts. */
  @Prop() amountColumns: string;

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
    const nonRecurringPrice = (this.state()?.product?.prices?.data || [])?.find(price => !price?.recurring_interval && price?.ad_hoc);
    const recurringPrices = (this.state()?.product?.prices?.data || [])?.filter(price => price?.recurring_interval && price?.ad_hoc);
    return (
      <sc-choices label={this.label} part="choices">
        <sc-recurring-price-choice-container
          label={this.recurringChoiceLabel}
          prices={recurringPrices}
          product={this.state()?.product}
          selectedPrice={this.state().selectedPrice}
          showDetails={false}
          showAmount={false}
          onScChange={e => {
            const selectedPrice = (this.state().product?.prices?.data || []).find(({ id }) => id == e.detail);
            this.updateState({ selectedPrice });
          }}
        />
        <sc-recurring-price-choice-container
          label={this.nonRecurringChoiceLabel}
          prices={[nonRecurringPrice]}
          product={this.state()?.product}
          selectedPrice={this.state().selectedPrice}
          showDetails={false}
          showAmount={false}
          onScChange={e => {
            const selectedPrice = (this.state().product?.prices?.data || []).find(({ id }) => id == e.detail);
            this.updateState({ selectedPrice });
          }}
        ></sc-recurring-price-choice-container>
      </sc-choices>
    );
  }
}
