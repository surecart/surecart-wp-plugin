/**
 * External dependencies.
 */
import { Component, Element, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { isProductOutOfStock } from '@store/product/getters';
import { state } from '@store/product';
import { onChange } from '@store/product';
import { getProductBuyLink, submitCartForm } from '@store/product/mutations';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  /**
   * Text
   */
  @Prop() text: string = __('Add to Cart', 'surecart');

  /**
   * Out of stock text.
   */
  @Prop() outOfStockText: string = __('Out of Stock', 'surecart');

  /**
   * Classes
   */
  @Prop() classes: string = '';

  /**
   * Styles
   */
  @Prop() styles: string = '';

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  handleCartClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (state.busy) return;

    // ad hoc price, use the dialog.
    if (state?.selectedPrice?.ad_hoc) {
      return (state.dialog = this.addToCart ? 'ad_hoc_cart' : 'ad_hoc_buy');
    }

    // if add to cart is undefined/false navigate to buy url
    if (!this.addToCart) {
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!checkoutUrl) return;
      return window.location.assign(getProductBuyLink(checkoutUrl, { no_cart: !this.addToCart }));
    }

    // submit the cart form.
    submitCartForm();
  }

  getInStockText() {
    return state.product?.archived || !state.product?.prices?.data?.length ? __('Unavailable For Purchase', 'surecart') : this.text;
  }

  private link: HTMLAnchorElement;
  componentDidLoad() {
    this.link = this.el.querySelector('a');
    this.updateProductLink();
    onChange('selectedPrice', () => this.updateProductLink());
  }

  updateProductLink() {
    const checkoutUrl = window?.scData?.pages?.checkout;
    if (!checkoutUrl || !this.link) return;
    this.link.href = getProductBuyLink(checkoutUrl, !this.addToCart ? { no_cart: true } : {});
  }

  render() {
    return (
      <Host
        class={{ 'is-busy': state.busy, 'is-disabled': isProductOutOfStock() || state.disabled, 'is-out-of-stock': isProductOutOfStock() }}
        onClick={e => this.handleCartClick(e)}
      >
        <a class={`wp-block-button__link wp-element-button sc-button ${this.classes}`}>
          {isProductOutOfStock() ? (
            <span>{this.outOfStockText}</span>
          ) : (
            <span>
              <span data-text>{this.getInStockText()}</span>
              {this.addToCart && <sc-spinner data-loader></sc-spinner>}
            </span>
          )}
        </a>
        <slot />
      </Host>
    );
  }
}
