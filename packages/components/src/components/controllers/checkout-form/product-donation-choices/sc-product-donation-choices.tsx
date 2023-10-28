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
  @Prop() amountLabel: string;

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
      <div class="sc-product-donation-choices" style={{ '--columns': this.amountColumns }}>
        <sc-choices label={this.amountLabel}>
          <slot />
        </sc-choices>
        <div class="sc-donation-recurring-choices" part="base">
          <sc-choices label={this.recurringLabel} part="choices">
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
            <sc-choice-container
              show-control="false"
              value={nonRecurringPrice?.id}
              checked={this.state().selectedPrice?.id === nonRecurringPrice?.id}
              part="choice"
              onScChange={() => this.updateState({ selectedPrice: nonRecurringPrice })}
            >
              <div class="price-choice__title">
                <div class="price-choice__name">{this.nonRecurringChoiceLabel}</div>
              </div>
            </sc-choice-container>
          </sc-choices>
        </div>
      </div>
    );
  }
}
