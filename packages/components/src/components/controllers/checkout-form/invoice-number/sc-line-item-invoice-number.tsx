/**
 * External dependencies.
 */
import { Component, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { formBusy } from '@store/form/getters';
import { state as checkoutState } from '@store/checkout';
import { Invoice } from '../../../../types';

@Component({
  tag: 'sc-line-item-invoice-number',
  styleUrl: 'sc-line-item-invoice-number.scss',
  shadow: true,
})
export class ScLineItemInvoiceNumber {
  render() {
    const checkout = checkoutState?.checkout;
    const invoiceNumber = (checkout?.invoice as Invoice)?.order_number || null;

    // Stop if checkout has no invoice number.
    if (!invoiceNumber) {
      return null;
    }

    // loading state
    if (formBusy() && !checkout?.invoice) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '50px', 'display': 'inline-block', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <sc-line-item>
        <span slot="description">
          <slot name="title">{__('Invoice Number', 'surecart')}</slot>
        </span>
        <span slot="price-description">#{invoiceNumber}</span>
      </sc-line-item>
    );
  }
}
