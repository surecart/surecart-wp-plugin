import { Component, Element, h, Prop } from '@stencil/core';
import { onChange, state } from '@store/product';
import { __ } from '@wordpress/i18n';

import { getProductBuyLink, submitCartForm } from '@store/product/mutations';
import { setProduct } from '@store/product/setters';

@Component({
  tag: 'sc-product-price-modal',
  styleUrl: 'sc-product-price-modal.scss',
  shadow: true,
})
export class ScProductPriceModal {
  @Element() el: HTMLScProductBuyButtonElement;

  private priceInput: HTMLScPriceInputElement;

  /** The button text */
  @Prop() buttonText: string;

  /** Whether to add to cart */
  @Prop() addToCart: boolean;

  /** The product id */
  @Prop() productId: string;

  submit() {
    // if add to cart is undefined/false navigate to buy url
    if (!this.addToCart) {
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!checkoutUrl) return;
      return window.location.assign(getProductBuyLink(this.productId, checkoutUrl));
    }

    submitCartForm(this.productId);
  }

  componentWillLoad() {
    // focus on price input when opened.
    onChange(this.productId, val => {
      if (val[this.productId].dialog === 'ad_hoc') {
        setTimeout(() => {
          this.priceInput?.triggerFocus();
        }, 50);
      }
    });
  }

  render() {
    if (!state[this.productId]?.selectedPrice?.ad_hoc) {
      return null;
    }

    return (
      <sc-dialog open={state[this.productId].dialog === (this?.addToCart ? 'ad_hoc_cart' : 'ad_hoc_buy')} onScRequestClose={() => (state.dialog = null)}>
        <span class="dialog__header" slot="label">
          {!!state[this.productId]?.product?.image_url && (
            <div class="dialog__image">
              <img src={state[this.productId]?.product?.image_url} />
            </div>
          )}
          <div class="dialog__header-text">
            <div class="dialog__action">{__('Enter An Amount', 'surecart')}</div>
            <div class="dialog__product-name">{state[this.productId]?.product?.name}</div>
          </div>
        </span>

        <sc-form
          onScSubmit={e => {
            e.stopImmediatePropagation();
            this.submit();
          }}
          onScFormSubmit={e => e.stopImmediatePropagation()}
        >
          <sc-price-input
            ref={el => (this.priceInput = el as HTMLScPriceInputElement)}
            value={state[this.productId].adHocAmount?.toString?.()}
            currency-code={state[this.productId]?.selectedPrice?.currency}
            min={state[this.productId]?.selectedPrice?.ad_hoc_min_amount}
            max={state[this.productId]?.selectedPrice?.ad_hoc_max_amount}
            onScInput={e => setProduct(this.productId, { adHocAmount: parseInt(e.target.value) })}
            required
          />
          <sc-button type="primary" full submit busy={state[this.productId].busy}>
            <slot>{this.buttonText || __('Add To Cart', 'surecart')}</slot>
          </sc-button>
        </sc-form>
      </sc-dialog>
    );
  }
}
