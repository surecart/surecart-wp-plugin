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
  tag: 'sc-line-item-invoice-due-date',
  styleUrl: 'sc-line-item-invoice-due-date.scss',
  shadow: true,
})
export class ScLineItemInvoiceDueDate {
  render() {
    const checkout = checkoutState?.checkout;
    const dueDate = (checkout?.invoice as Invoice)?.due_date_date || null;

    // Stop if checkout has no invoice due date.
    if (!dueDate) {
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
          <slot name="title">{__('Due Date', 'surecart')}</slot>
        </span>
        <span slot="price-description">{dueDate}</span>
      </sc-line-item>
    );
  }
}
