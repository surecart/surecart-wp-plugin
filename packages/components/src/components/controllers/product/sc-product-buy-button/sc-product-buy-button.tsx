import { Component, Element, Event, EventEmitter, h, Host, Prop } from '@stencil/core';
import { state } from '@store/product';
import { __ } from '@wordpress/i18n';
import { getProductBuyLink, submitCartForm } from '@store/product/mutations';
import { CartGoogleAnalyticsItem, Product } from 'src/types';
import { getCheckout } from '@store/checkouts';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  /** Item added to cart */
  @Event() scAddedToCart: EventEmitter<CartGoogleAnalyticsItem>;

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  async handleCartClick(e) {
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

      return window.location.assign(getProductBuyLink(checkoutUrl));
    }

    // submit the cart form.
    await submitCartForm();

    const checkout = getCheckout(state?.formId, state.mode);
    const newLineItem = checkout.line_items?.data.find(item => item.price.id === state.selectedPrice?.id);
    this.scAddedToCart.emit({
      item_id: (newLineItem.price?.product as Product)?.id,
      item_name: (newLineItem.price?.product as Product)?.name,
      item_variant: newLineItem.price?.name,
      price: newLineItem.price?.amount,
      currency: newLineItem.price?.currency,
      quantity: newLineItem.quantity,
      discount: newLineItem.discount_amount,
    });
  }

  render() {
    return (
      <Host class={{ 'is-busy': state.busy && !!this.addToCart, 'is-disabled': state.disabled }} onClick={e => this.handleCartClick(e)}>
        <slot />
      </Host>
    );
  }
}
