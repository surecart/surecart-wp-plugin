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
import { Invoice } from '../../../../types';

@Component({
  tag: 'sc-invoice-memo',
  styleUrl: 'sc-invoice-memo.scss',
  shadow: true,
})
export class ScLineItemInvoiceMemo {
  /** Memo Label */
  @Prop() text: string;

  render() {
    const checkout = checkoutState?.checkout;
    const memo = (checkout?.invoice as Invoice)?.memo || null;

    // Stop if checkout has no invoice number.
    if (!memo) {
      return null;
    }

    // loading state
    if (formBusy() && !checkout?.invoice) {
      return (
        <div>
          <sc-skeleton style={{ width: '100px' }}></sc-skeleton>
          <sc-skeleton style={{ width: '200px' }}></sc-skeleton>
        </div>
      );
    }

    return (
      <div class="invoice-memo">
        <div class="invoice-memo__title">{this.text || __('Memo', 'surecart')}</div>
        <div class="invoice-memo__content">{memo}</div>
      </div>
    );
  }
}
