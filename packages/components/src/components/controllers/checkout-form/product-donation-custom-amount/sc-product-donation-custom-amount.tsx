import { Component, h, Prop, Element, Host } from '@stencil/core';
import { state as donationState } from '@store/product-donation';
@Component({
  tag: 'sc-product-donation-custom-amount',
  styleUrl: 'sc-product-donation-custom-amount.scss',
})
export class ScProductDonationCustomAmount {
  @Element() el: HTMLScProductDonationCustomAmountElement;
  priceInput: HTMLScPriceInputElement;

  /** Selected Product Id for the donation. */
  @Prop() productId: string;

  /** Custom Amount of the donation. */
  @Prop() value: number;

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
    const checked = !!this.state().custom_amount;
    return (
      <Host class={{ 'sc-product-donation-custom-amount': true, 'sc-product-donation-custom-amount--has-value': !!this.value }}>
        <sc-choice-container value={`${this.state()?.custom_amount}`} show-control="false" checked={checked} onClick={() => this.priceInput.triggerFocus()}>
          <sc-price-input
            ref={el => (this.priceInput = el)}
            currencyCode={this.state()?.selectedPrice?.currency}
            showCode={false}
            showLabel={false}
            value={`${this.state()?.custom_amount || ''}`}
            onScChange={e =>
              this.updateState({
                ad_hoc_amount: null,
                custom_amount: e.target.value,
              })
            }
            min={this.state()?.selectedPrice?.ad_hoc_min_amount}
            max={this.state()?.selectedPrice?.ad_hoc_max_amount}
            style={{ '--sc-input-border-color-focus': 'var(--sc-input-border-color-hover)', '--sc-focus-ring-color-primary': 'transparent' }}
          />
        </sc-choice-container>
      </Host>
    );
  }
}
