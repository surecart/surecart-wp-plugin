/**
 * External dependencies.
 */
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { formBusy } from '@store/form/getters';
import { state as checkoutState } from '@store/checkout';
import { Checkout, Invoice } from '../../../../types';

@Component({
  tag: 'sc-line-item-invoice-due-date',
  styleUrl: 'sc-line-item-invoice-due-date.scss',
  shadow: true,
})
export class ScLineItemInvoiceDueDate {
  @Prop() checkout: Checkout;

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    // Stop if checkout has no invoice.
    // TODO: Uncomment this when the invoice expand is implemented on checkout.
    // if (!(checkout?.invoice as Invoice)?.id) {
    //   return null;
    // }

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
      <sc-line-item>
        <span slot="title">
          <slot name="title" />
        </span>
        <span slot="price">
          {(checkout?.invoice as Invoice)?.due_date ? (
            <sc-format-date date={(checkout?.invoice as Invoice)?.due_date} type="timestamp" month="short" day="numeric" year="numeric"></sc-format-date>
          ) : (
            '-'
          )}
        </span>
      </sc-line-item>
    );
  }
}
