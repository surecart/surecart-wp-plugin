/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as upsellState } from '@store/upsell';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { createOrUpdateUpsell } from '@store/upsell/mutations';

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
    createOrUpdateUpsell();
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
