/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as upsellState } from '@store/upsell';
import { state as checkoutState } from '@store/checkout';
import { state as productState } from '@store/product';
import { Checkout, Price, Product } from 'src/types';
import { updateCheckout } from '@services/session';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { createErrorNotice } from '@store/notices/mutations';

@Component({
  tag: 'sc-upsell-submit-button',
  styleUrl: 'sc-upsell-submit-button.scss',
  shadow: false,
})
export class ScUpsellSubmitButton {
  @Element() el: HTMLScUpsellSubmitButtonElement;

  getProductId() {
    return ((upsellState.upsell?.price as Price)?.product as Product)?.id || ((upsellState.upsell?.price as Price)?.product as string);
  }

  async handleAddToOrderClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (upsellState.busy) return;

    try {
      upsellState.busy = true;

      // Get the upsell price.
      const priceId = (upsellState.upsell.price as Price)?.id || (upsellState.upsell?.price as string);

      const previousLineItems = (checkoutState.checkout.line_items.data || []).map(lineItem => ({
        id: lineItem.id,
        price_id: lineItem.price.id,
        quantity: lineItem.quantity,
      }));

      checkoutState.checkout = (await updateCheckout({
        id: checkoutState.checkout.id,
        data: {
          line_items: [
            ...previousLineItems,
            {
              price_id: priceId,
              quantity: productState.quantity,
              upsell: upsellState.upsell?.id,
            },
          ],
        },
      })) as Checkout;

      // Redirect to checkout.
      const checkoutUrl = window?.scData?.pages?.checkout;
      if (!!checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      createErrorNotice(error);
    } finally {
      upsellState.busy = false;
    }
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': upsellState.busy,
          'is-disabled': upsellState.disabled,
          'is-sold-out': isProductOutOfStock(this.getProductId()) && !isSelectedVariantMissing(this.getProductId()),
          'is-unavailable': isSelectedVariantMissing(this.getProductId()),
        }}
        onClick={e => this.handleAddToOrderClick(e)}
      >
        <slot />
      </Host>
    );
  }
}
