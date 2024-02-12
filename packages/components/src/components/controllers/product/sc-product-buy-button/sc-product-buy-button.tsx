import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { getProductBuyLink, submitCartForm } from '@store/product/mutations';
import { state } from '@store/product';
import { setProduct } from '@store/product/setters';
import { onChange } from '@store/product';
import { ScNoticeStore } from '../../../../types';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { getTopLevelError, getAdditionalErrorMessages } from '../../../../functions/error';

@Component({
  tag: 'sc-product-buy-button',
  styleUrl: 'sc-product-buy-button.scss',
  shadow: false,
})
export class ScProductBuyButton {
  @Element() el: HTMLScProductBuyButtonElement;

  // Is add to cart enabled
  @Prop() addToCart: boolean;

  // The product id.
  @Prop() productId: string;

  // The form id
  @Prop() formId: number;

  // The mode
  @Prop() mode: 'live' | 'test' = 'live';

  // checkout link
  @Prop() checkoutLink: string;

  // Is add to cart enabled
  @State() error: ScNoticeStore;

  async handleCartClick(e) {
    e.preventDefault();

    console.log(e);

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
      return window.location.assign(getProductBuyLink(this.productId, checkoutUrl, { no_cart: !this.addToCart }));
    }

    // submit the cart form.
    try {
      console.log('submit');
      await submitCartForm(this.productId);
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  }

  componentDidLoad() {
    this.link = this.el.querySelector('a');
    this.updateProductLink();
    onChange(this.productId, () => this.updateProductLink());
  }

  private link: HTMLAnchorElement;

  updateProductLink() {
    const checkoutUrl = window?.scData?.pages?.checkout;
    if (!checkoutUrl || !this.link) return;
    this.link.href = getProductBuyLink(this.productId, checkoutUrl, !this.addToCart ? { no_cart: true } : {});
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': state[this.productId]?.busy && !!this.addToCart,
          'is-disabled': state[this.productId]?.disabled,
          'is-sold-out': isProductOutOfStock(this.productId) && !isSelectedVariantMissing(this.productId),
          'is-unavailable': isSelectedVariantMissing(this.productId),
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
