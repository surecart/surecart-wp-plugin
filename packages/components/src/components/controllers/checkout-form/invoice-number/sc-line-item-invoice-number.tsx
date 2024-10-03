/**
 * External dependencies.
 */
import { Component, Host, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { formBusy } from '@store/form/getters';
import { state as checkoutState } from '@store/checkout';
import { Checkout, Invoice } from '../../../../types';

@Component({
  tag: 'sc-line-item-invoice-number',
  styleUrl: 'sc-line-item-invoice-number.scss',
  shadow: true,
})
export class ScLineItemInvoiceNumber {
  @Prop() checkout: Checkout;

  /** The invoice number */
  @Prop({ mutable: true }) number?: string;

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    const invoiceNumber = this.number || (checkout?.invoice as Invoice)?.order_number || null;

    // Stop if checkout has no invoice number.
    if (!invoiceNumber) {
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
            <slot name="description">{__('Invoice Number', 'surecart')}</slot>
          </span>
          <span slot="price-description">#{invoiceNumber}</span>
        </sc-line-item>
      </Host>
    );
  }
}
