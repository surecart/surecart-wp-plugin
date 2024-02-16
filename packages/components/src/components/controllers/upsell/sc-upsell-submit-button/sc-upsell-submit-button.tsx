/**
 * External dependencies.
 */
import { Component, Element, h, Host } from '@stencil/core';

/**
 * Internal dependencies.
 */
import { state as upsellState } from '@store/upsell';
import { state as noticesState } from '@store/notices';
import { isProductOutOfStock, isSelectedVariantMissing } from '@store/product/getters';
import { accept } from '@store/upsell/mutations';
import { isBusy } from '@store/upsell/getters';

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
    accept();
  }

  render() {
    return (
      <Host
        class={{
          'is-busy': isBusy(),
          'is-disabled': upsellState.disabled,
          // TODO: change this to out of stock error message.
          'is-sold-out': (isProductOutOfStock(this.getUpsellProductId()) && !isSelectedVariantMissing(this.getUpsellProductId())) || !!noticesState?.message,
          'is-unavailable': isSelectedVariantMissing(this.getUpsellProductId()),
        }}
        onClick={e => this.handleAddToOrderClick(e)}
      >
        <slot />
      </Host>
    );
  }
}
