import { Component, Element, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addProductToState, getProductBuyLink, submitCartForm } from '@store/product/mutations';
import { state } from '@store/product';
import { setProduct } from '@store/product/setters';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  // The product id
  @Prop() productId: string;

  handleCartClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (state[this.productId]?.busy) return;

    // ad hoc price, use the dialog.
    if (state[this.productId]?.selectedPrice?.ad_hoc) {
     setProduct(this.productId, { dialog: this.addToCart ? 'ad_hoc_cart' : 'ad_hoc_buy' });
     return;
    }

    // if add to cart is undefined/false navigate to buy url
    if (!this.addToCart) {
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!checkoutUrl) return;
      return window.location.assign(getProductBuyLink(this.productId,checkoutUrl));
    }

    // submit the cart form.
    submitCartForm(this.productId);
  }

  componentDidLoad() {
    if (!state[this.productId]) {
      addProductToState(this.productId, {});
    }
  }

  render() {
    return (
      <Host class={{ 'is-busy': state[this.productId]?.busy && !!this.addToCart, 'is-disabled': state[this.productId]?.disabled }} onClick={e => this.handleCartClick(e)}>
        <slot />
      </Host>
    );
  }
}
