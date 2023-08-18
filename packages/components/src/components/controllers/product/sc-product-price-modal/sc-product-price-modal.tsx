import { Component, Element, h, Prop } from '@stencil/core';
import { onChange, state } from '@store/product';
import { __ } from '@wordpress/i18n';

import { getProductBuyLink, submitCartForm } from '@store/product/mutations';

@Component({
  tag: 'sc-product-price-modal',
  styleUrl: 'sc-product-price-modal.scss',
  shadow: true,
})
export class ScProductPriceModal {
  @Element() el: HTMLScProductBuyButtonElement;

  private priceInput: HTMLScPriceInputElement;

  @Prop() buttonText: string;

  @Prop() addToCart: boolean;

  submit() {
    // if add to cart is undefined/false navigate to buy url
    if (!this.addToCart) {
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!checkoutUrl) return;
      return window.location.assign(getProductBuyLink(checkoutUrl));
    }

    submitCartForm();
  }

  componentWillLoad() {
    // focus on price input when opened.
    onChange('dialog', val => {
      if (val === 'ad_hoc') {
        setTimeout(() => {
          this.priceInput?.triggerFocus();
        }, 50);
      }
    });
  }

  render() {
    if (!state?.selectedPrice?.ad_hoc) {
      return null;
    }

    return (
      <sc-dialog open={state.dialog === (this?.addToCart ? 'ad_hoc_cart' : 'ad_hoc_buy')} onScRequestClose={() => (state.dialog = null)}>
        <span class="dialog__header" slot="label">
          {!!state?.product?.image_url && (
            <div class="dialog__image">
              <img src={state?.product?.image_url} />
            </div>
          )}
          <div class="dialog__header-text">
            <div class="dialog__action">{__('Enter An Amount', 'surecart')}</div>
            <div class="dialog__product-name">{state?.product?.name}</div>
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
            value={state.adHocAmount?.toString?.()}
            currency-code={state?.selectedPrice?.currency}
            min={state?.selectedPrice?.ad_hoc_min_amount}
            max={state?.selectedPrice?.ad_hoc_max_amount}
            onScInput={e => (state.adHocAmount = parseInt(e.target.value))}
            required
          />
          <sc-button type="primary" full submit busy={state.busy}>
            <slot>{this.buttonText || __('Add To Cart', 'surecart')}</slot>
          </sc-button>
        </sc-form>
      </sc-dialog>
    );
  }
}
