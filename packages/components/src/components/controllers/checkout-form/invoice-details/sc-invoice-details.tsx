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
  tag: 'sc-invoice-details',
  styleUrl: 'sc-invoice-details.scss',
  shadow: true,
})
export class ScInvoiceDetails {
  render() {
    return (
      <Host style={{ ...(!checkoutState?.checkout?.invoice ? { display: 'none' } : {}) }}>
        <div class="invoice-details">
          <slot />
        </div>
      </Host>
    );
  }
}
