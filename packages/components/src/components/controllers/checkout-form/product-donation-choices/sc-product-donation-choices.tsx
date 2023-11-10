import { Component, h, Prop, Element, Host } from '@stencil/core';
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

  @Prop() recurring: boolean;

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
    const prices = (this.state()?.product?.prices?.data || [])?.filter(price =>
      this.recurring ? price?.recurring_interval && price?.ad_hoc : !price?.recurring_interval && price?.ad_hoc,
    );

    // no prices, return nothing
    if (!prices?.length) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    // return price choice container.
    return (
      <sc-recurring-price-choice-container
        prices={prices}
        product={this.state()?.product}
        selectedPrice={this.state().selectedPrice}
        showDetails={false}
        showAmount={false}
        onScChange={e => {
          const selectedPrice = (this.state().product?.prices?.data || []).find(({ id }) => id == e.detail);
          this.updateState({ selectedPrice });
        }}
      >
        <slot>{this.label}</slot>
      </sc-recurring-price-choice-container>
    );
  }
}
