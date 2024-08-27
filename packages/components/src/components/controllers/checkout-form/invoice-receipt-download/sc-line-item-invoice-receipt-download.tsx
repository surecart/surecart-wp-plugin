/**
 * External dependencies.
 */
import { Component, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { formBusy } from '@store/form/getters';
import { state as checkoutState } from '@store/checkout';
import { Checkout, Invoice } from '../../../../types';

@Component({
  tag: 'sc-line-item-invoice-receipt-download',
  styleUrl: 'sc-line-item-invoice-receipt-download.scss',
  shadow: true,
})
export class ScLineItemInvoiceReceiptDownload {
  @Prop() checkout: Checkout;

  /** The invoice receipt download link */
  @Prop({ mutable: true }) receiptDownloadLink?: string;

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    const receiptDownloadLink = this.receiptDownloadLink || ((checkout?.invoice as Invoice)?.id ? checkout?.pdf_url : null);

    // Stop if checkout has no receipt download link.
    if (!receiptDownloadLink) {
      return null;
    }

    // loading state
    if (formBusy()) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '50px', 'display': 'inline-block', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <Host>
        <sc-line-item>
          <span slot="description">
            <slot name="description">{__('Invoice Receipt', 'surecart')}</slot>
          </span>
          <span slot="price-description">
            <a class="sc-invoice-download-link" href={receiptDownloadLink} target="_blank" rel="noopener noreferrer">
              <sc-icon name="download" />
            </a>
          </span>
        </sc-line-item>
      </Host>
    );
  }
}
