import { Component, Element, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { getProductBuyLink, submitCartForm } from '@store/product/mutations';
import { state } from '@store/product';
import { setProduct } from '@store/product/setters';
import { onChange } from '@store/product';
import { Product } from 'src/types';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  // The product
  @Prop() product: Product;

  // The form id
  @Prop() formId: number;

  // The mode
  @Prop() mode: 'live' | 'test' = 'live';

  // checkout link
  @Prop() checkoutLink: string;

  handleCartClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (state[this.product?.id]?.busy) return;

    // ad hoc price, use the dialog.
    if (state[this.product?.id]?.selectedPrice?.ad_hoc) {
      setProduct(this.product?.id, { dialog: this.addToCart ? 'ad_hoc_cart' : 'ad_hoc_buy' });
      return;
    }

    // if add to cart is undefined/false navigate to buy url
    if (!this.addToCart) {
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!checkoutUrl) return;
      return window.location.assign(getProductBuyLink(this.product?.id, checkoutUrl, { no_cart: !this.addToCart }));
    }

    // submit the cart form.
    submitCartForm(this.product?.id);
  }

  componentDidLoad() {
    this.link = this.el.querySelector('a');
    this.updateProductLink();
    onChange(this.product?.id, () => this.updateProductLink());
  }

  private link: HTMLAnchorElement;

  updateProductLink() {
    const checkoutUrl = window?.scData?.pages?.checkout;
    if (!checkoutUrl || !this.link) return;
    this.link.href = getProductBuyLink(this.product?.id, checkoutUrl, !this.addToCart ? { no_cart: true } : {});
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': state[this.product?.id]?.busy && !!this.addToCart,
          'is-disabled': state[this.product?.id]?.disabled,
          'is-sold-out': isProductOutOfStock(this.product?.id) && !isSelectedVariantMissing(this.product?.id),
          'is-unavailable': isSelectedVariantMissing(this.product?.id),
        }}
        onClick={e => this.handleCartClick(e)}
      >
        <slot />
      </Host>
    );
  }
}
