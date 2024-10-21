/**
 * External dependencies.
 */
import { Component, Host, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state as checkoutState } from '@store/checkout';

@Component({
  tag: 'sc-invoice-additional',
  styleUrl: 'sc-invoice-additional.scss',
  shadow: true,
})
export class ScInvoiceAdditional {
  render() {
    return (
      <Host style={{ ...(!checkoutState?.checkout?.invoice ? { display: 'none' } : {}) }}>
        <div class="invoice-additional">
          <slot />
        </div>
      </Host>
    );
  }
}
