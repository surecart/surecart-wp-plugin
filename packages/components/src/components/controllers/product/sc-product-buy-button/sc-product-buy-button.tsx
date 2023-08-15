import { Component, Element, h, Host, Prop } from '@stencil/core';
import { state } from '@store/product';
import { __ } from '@wordpress/i18n';
import { submitCartForm } from '@store/product/mutations';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  /**
   * Whether the product is out of stock.
   */
  @Prop() isOutOfStock: boolean = false;

  handleCartClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (state.busy) return;

    // ad hoc price, use the dialog.
    if (state?.selectedPrice?.ad_hoc) {
      return (state.dialog = 'ad_hoc');
    }

    // submit the cart form.
    submitCartForm();
  }

  render() {
    return (
      <Host class={{ 'is-busy': state.busy, 'is-disabled': this.isOutOfStock || state.disabled, 'is-out-of-stock': this.isOutOfStock }} onClick={e => this.handleCartClick(e)}>
        <slot />
      </Host>
    );
  }
}
