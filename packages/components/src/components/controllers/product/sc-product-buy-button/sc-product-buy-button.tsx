import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { state } from '@store/product';
import { __ } from '@wordpress/i18n';
import { onChange } from '@store/product';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { getProductBuyLink, submitCartForm } from '@store/product/mutations';
import { getAdditionalErrorMessages, getTopLevelError } from '../../../../functions/error';
import { ScNoticeStore } from '../../../../types';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  // Is add to cart enabled
  @State() error: ScNoticeStore;

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
      return window.location.assign(getProductBuyLink(checkoutUrl, { no_cart: !this.addToCart }));
    }

    // submit the cart form.
    try {
      await submitCartForm();
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  }

  private link: HTMLAnchorElement;
  componentDidLoad() {
    this.link = this.el.querySelector('a');
    this.updateProductLink();
    onChange('selectedPrice', () => this.updateProductLink());
    onChange('selectedVariant', () => this.updateProductLink());
  }

  updateProductLink() {
    const checkoutUrl = window?.scData?.pages?.checkout;
    if (!checkoutUrl || !this.link) return;
    this.link.href = getProductBuyLink(checkoutUrl, !this.addToCart ? { no_cart: true } : {});
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': state.busy && !!this.addToCart,
          'is-disabled': state.disabled,
          'is-sold-out': isProductOutOfStock() && !isSelectedVariantMissing(),
          'is-unavailable': isSelectedVariantMissing(),
        }}
        onClick={e => this.handleCartClick(e)}
      >
        {!!this.error && (
          <sc-alert
            onClick={event => {
              event.stopPropagation();
            }}
            type="danger"
            scrollOnOpen={true}
            open={!!this.error}
            closable={false}
          >
            {!!getTopLevelError(this.error) && <span slot="title" innerHTML={getTopLevelError(this.error)}></span>}
            {(getAdditionalErrorMessages(this.error) || []).map((message, index) => (
              <div innerHTML={message} key={index}></div>
            ))}
          </sc-alert>
        )}
        <slot />
      </Host>
    );
  }
}
