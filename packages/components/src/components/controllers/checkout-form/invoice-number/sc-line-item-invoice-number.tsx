/**
 * External dependencies.
 */
import { Component, Fragment, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { formBusy } from '@store/form/getters';
import { state as checkoutState } from '@store/checkout';
import { Checkout, Order } from '../../../../types';
// import { Invoice } from '../../../../types';

@Component({
  tag: 'sc-line-item-invoice-number',
  styleUrl: 'sc-line-item-invoice-number.scss',
  shadow: true,
})
export class ScLineItemInvoiceNumber {
  @Prop() checkout: Checkout;

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    // Stop if checkout has no invoice or order.
    // TODO: Uncomment this when the invoice expand is implemented on checkout.
    // if (!(checkout?.invoice as Invoice)?.id && !(checkout?.order as Order)?.number) {
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
      <Fragment>
        <sc-line-item>
          <span slot="title">
            <slot name="title" />
          </span>
          <span slot="price">#{(checkout?.order as Order)?.number || __('N/A', 'surecart')}</span>
        </sc-line-item>
      </Fragment>
    );
  }
}
