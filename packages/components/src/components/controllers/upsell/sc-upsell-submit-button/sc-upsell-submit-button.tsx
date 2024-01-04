/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import { state as upsellState } from '@store/upsell';
import { state as productState } from '@store/product';
import { Price, Product } from 'src/types';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { createErrorNotice } from '@store/notices/mutations';
import { redirectUpsell } from '@store/upsell/mutations';

@Component({
  tag: 'sc-upsell-submit-button',
  styleUrl: 'sc-upsell-submit-button.scss',
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

      // Add Upsell to line item.
      const upsellLineItem = {
        upsell: upsellState.upsell?.id,
        price: priceId,
        quantity: productState.quantity || 1,
        checkout: upsellState.checkout_id,
      };

      (await apiFetch({
        path: addQueryArgs(`surecart/v1/line_items/upsell`),
        method: 'POST',
        data: {
          line_item: upsellLineItem,
        },
      }) as any);

      // Redirect to next Upsell or checkout success URL.
      redirectUpsell();
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
