/**
 * External dependencies.
 */
import { Component, Element, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state } from '@store/product';
import { submitCartForm } from '@store/product/mutations';
import { isProductOutOfStock } from '@store/product/getters';

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

  getInStockText() {
    return state.product.archived || !state.product?.prices?.data?.length ? __('Unavailable For Purchase', 'surecart') : this.text;
  }

  render() {
    return (
      <Host
        class={{ 'is-busy': state.busy, 'is-disabled': isProductOutOfStock() || state.disabled, 'is-out-of-stock': isProductOutOfStock() }}
        onClick={e => this.handleCartClick(e)}
      >
        <a class={`wp-block-button__link wp-element-button sc-button ${this.classes}`}>
          {isProductOutOfStock() ? (
            <span data-text>{this.outOfStockText}</span>
          ) : (
            <span>
              <span data-text>{this.getInStockText()}</span>
              <sc-spinner data-loader></sc-spinner>
            </span>
          )}
        </a>
        <slot />
      </Host>
    );
  }
}
