/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as upsellState } from '@store/upsell';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { purchaseUpsell } from '@store/upsell/mutations';

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
    purchaseUpsell();
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': upsellState.loading === 'busy',
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
