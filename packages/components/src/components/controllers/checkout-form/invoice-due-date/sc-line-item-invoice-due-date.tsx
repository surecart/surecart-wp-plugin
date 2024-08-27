/**
 * External dependencies.
 */
import { Component, h, Prop, Host } from '@stencil/core';
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

  /** The invoice due date */
  @Prop({ mutable: true }) dueDate?: string;

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    const dueDate = this.dueDate || (checkout?.invoice as Invoice)?.due_date || null;

    // Stop if checkout has no invoice due date.
    if (!dueDate) {
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
            <slot name="description">{__('Invoice Due Date', 'surecart')}</slot>
          </span>
          <span slot="price-description">
            <sc-format-date date={dueDate} type="timestamp" month="short" day="numeric" year="numeric"></sc-format-date>
          </span>
        </sc-line-item>
      </Host>
    );
  }
}
