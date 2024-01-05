/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as upsellState } from '@store/upsell';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { createOrUpdateUpsell, redirectUpsell } from '@store/upsell/mutations';

@Component({
  tag: 'sc-upsell-submit-button',
  styleUrl: 'sc-upsell-submit-button.scss',
})
export class ScUpsellSubmitButton {
  @Element() el: HTMLScUpsellSubmitButtonElement;

  getUpsellProductId() {
    return upsellState.product?.id || '';
  }

  async handleAddToOrderClick(e) {
    e.preventDefault();

    // already busy, do nothing.
    if (upsellState.busy) return;

    try {
      upsellState.busy = true;

      // Create or update the upsell. states
      await createOrUpdateUpsell();
      upsellState.busy = false;

      // Redirect to next Upsell or checkout success URL.
      redirectUpsell();
    } catch (error) {
      console.error(error); // Errors handled by the store.
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
          'is-sold-out': isProductOutOfStock(this.getUpsellProductId()) && !isSelectedVariantMissing(this.getUpsellProductId()),
          'is-unavailable': isSelectedVariantMissing(this.getUpsellProductId()),
        }}
        onClick={e => this.handleAddToOrderClick(e)}
      >
        <slot />
      </Host>
    );
  }
}
