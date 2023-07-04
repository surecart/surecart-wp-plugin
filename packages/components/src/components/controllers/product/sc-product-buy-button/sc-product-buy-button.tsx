import { Component, Element, h, Host, Prop } from '@stencil/core';
import { state } from '@store/product';
import { __ } from '@wordpress/i18n';
import { getProductBuyLink, submitCartForm } from '@store/product/mutations';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  handleCartClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (state.busy) return;

    // if add to cart is undefined/false navigate to buy url
    if (!this.addToCart) {
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!checkoutUrl) return;
      const buyLink = getProductBuyLink(checkoutUrl);
      window.location.assign(buyLink);
      return;
    }

    // ad hoc price, use the dialog.
    if (state?.selectedPrice?.ad_hoc) {
      return (state.dialog = 'ad_hoc');
    }

    // submit the cart form.
    submitCartForm();
  }

  render() {
    return (
      <Host class={{ 'is-busy': state.busy, 'is-disabled': state.disabled }} onClick={e => this.handleCartClick(e)}>
        <slot />
      </Host>
    );
  }
}
