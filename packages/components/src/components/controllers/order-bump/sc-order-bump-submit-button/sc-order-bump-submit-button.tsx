/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as bumpState } from '@store/bump';
import { state as checkoutState } from '@store/checkout';
import { state as productState } from '@store/product';
import { Checkout, Price } from 'src/types';
import { updateCheckout } from '@services/session';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { createErrorNotice } from '@store/notices/mutations';

@Component({
  tag: 'sc-order-bump-submit-button',
  styleUrl: 'sc-order-bump-submit-button.scss',
  shadow: false,
})
export class ScOrderBumpSubmitButton {
  @Element() el: HTMLScOrderBumpSubmitButtonElement;

  async handleAddToOrderClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (bumpState.busy) return;

    try {
      bumpState.busy = true;

      // Get the bump price.
      const priceId = (bumpState.bump.price as Price)?.id || (bumpState.bump?.price as string);

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
              bump: bumpState.bump?.id,
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
      bumpState.busy = false;
    }
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': bumpState.busy,
          'is-disabled': bumpState.disabled,
          'is-sold-out': isProductOutOfStock() && !isSelectedVariantMissing(),
          'is-unavailable': isSelectedVariantMissing(),
        }}
        onClick={e => this.handleAddToOrderClick(e)}
      >
        <slot />
      </Host>
    );
  }
}
