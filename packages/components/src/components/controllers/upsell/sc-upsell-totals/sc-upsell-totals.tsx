/**
 * External dependencies.
 */
import { Component, Fragment, h } from '@stencil/core';
import { state } from '@store/upsell';
import { __, sprintf } from '@wordpress/i18n';
@Component({
  tag: 'sc-upsell-totals',
  styleUrl: 'sc-upsell-totals.css',
  shadow: true,
})
export class ScUpsellTotals {
  renderAmountDue() {
    return state.amount_due > 0 ? state?.line_item?.total_display_amount : !!state?.line_item?.trial_amount ? __('Trial', 'surecart') : __('Free', 'surecart');
  }

  renderConversion() {
    // need to check the checkout for a few things.
    const checkout = state?.checkout;

    if (!checkout?.show_converted_total) {
      return null;
    }

    // the currency is the same as the current currency.
    if (checkout?.currency === checkout?.current_currency) {
      return null;
    }

    // there is no amount due.
    if (!state?.line_item?.total_amount) {
      return null;
    }

    return (
      <Fragment>
        <sc-divider></sc-divider>
        <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
          <span slot="title">
            <slot name="charge-amount-description">{sprintf(__('Payment Total', 'surecart'), state?.line_item?.currency?.toUpperCase())}</slot>
          </span>
          <span slot="price">
            <span class="currency-label">{state?.line_item?.currency?.toUpperCase()}</span>
            {state?.line_item?.total_default_currency_display_amount}
          </span>
        </sc-line-item>
        <sc-line-item>
          <span slot="description" class="conversion-description">
            {/* Tranlators: %s is the currency code. */}
            {sprintf(__('Your payment will be processed in %s.', 'surecart'), state?.line_item?.currency?.toUpperCase())}
          </span>
        </sc-line-item>
      </Fragment>
    );
  }

  render() {
    return (
      <sc-summary open-text="Total" closed-text="Total" collapsible={true} collapsed={true}>
        {!!state.line_item?.id && <span slot="price">{this.renderAmountDue()}</span>}

        <sc-divider></sc-divider>

        <sc-line-item>
          <span slot="description">{__('Subtotal', 'surecart')}</span>
          <span slot="price">{state.line_item?.subtotal_display_amount}</span>
        </sc-line-item>

        {(state?.line_item?.fees?.data || [])
          .filter(fee => fee.fee_type === 'upsell') // only upsell fees.
          .map(fee => {
            return (
              <sc-line-item>
                <span slot="description">
                  {fee.description} {`(${__('one time', 'surecart')})`}
                </span>
                <span slot="price">{fee?.display_amount}</span>
              </sc-line-item>
            );
          })}

        {!!state.line_item?.tax_amount && (
          <sc-line-item>
            <span slot="description">{__('Tax', 'surecart')}</span>
            <span slot="price">{state.line_item?.tax_display_amount}</span>
          </sc-line-item>
        )}

        <sc-divider></sc-divider>

        <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
          <span slot="title">{__('Total', 'surecart')}</span>
          <span slot="price">{state.line_item?.total_display_amount}</span>
        </sc-line-item>

        {this.renderConversion()}
      </sc-summary>
    );
  }
}
