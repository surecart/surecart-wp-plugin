import { Component, h, Prop, Element, Host } from '@stencil/core';
import { state as donationState } from '@store/product-donation';
@Component({
  tag: 'sc-product-donation-custom-amount',
  styleUrl: 'sc-product-donation-custom-amount.scss',
})
export class ScProductDonationCustomAmount {
  @Element() el: HTMLScProductDonationCustomAmountElement;

  /** Currency code for the donation. */
  @Prop() currencyCode: string = 'usd';

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

  async handleButtonClick(e) {
    e.stopImmediatePropagation();
    this.updateState({
      ad_hoc_amount: this.value,
      amounts: [...this.state().amounts, this.value],
    });
  }

  handlePriceChange(e) {
    this.value = e?.target?.value;
  }

  render() {
    const checked = !this.state()?.amounts?.includes(this.state()?.ad_hoc_amount) || this.state()?.ad_hoc_amount === this.value;

    return (
      <Host class={{ 'sc-product-donation-custom-amount': true, 'sc-product-donation-custom-amount--has-value': !!this.value }}>
        <sc-choice-container value={`${this.value}`} show-control="false" checked={checked}>
          <sc-form onScFormSubmit={e => this.handleButtonClick(e)}>
            <sc-price-input
              currencyCode={this.currencyCode}
              showCode={false}
              showLabel={false}
              onScInput={e => this.handlePriceChange(e)}
              min={this.state()?.selectedPrice?.ad_hoc_min_amount}
              max={this.state()?.selectedPrice?.ad_hoc_max_amount}
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
