import { Component, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-invoice-details',
  styleUrl: 'sc-invoice-details.scss',
  shadow: true,
})
export class ScInvoiceDetails {
  render() {
    return (
      <div class='invoice-details'>
          <slot />
      </div>
    );
  }
}