/**
 * External dependencies.
 */
import { Component, h } from '@stencil/core';
import { state } from '@store/upsell';
import { __ } from '@wordpress/i18n';
@Component({
  tag: 'sc-upsell-totals',
  styleUrl: 'sc-upsell-totals.css',
  shadow: true,
})
export class ScUpsellTotals {
  renderAmountDue() {
    return state.amount_due > 0 ? (
      <sc-format-number type="currency" value={state.amount_due} currency={state?.line_item?.price?.currency || 'usd'}></sc-format-number>
    ) : !!state?.line_item?.trial_amount ? (
      __('Free Trial', 'surecart')
    ) : (
      __('Free', 'surecart')
    );
  }

  render() {
    return (
      <sc-summary open-text="Total" closed-text="Total" collapsible={true} collapsed={true}>
        {!!state.line_item?.id && <span slot="price">{this.renderAmountDue()}</span>}

        <sc-divider></sc-divider>

        <sc-line-item>
          <span slot="description">{__('Subtotal', 'surecart')}</span>
          <sc-format-number slot="price" type="currency" value={state.line_item?.subtotal_amount} currency={state?.line_item?.price?.currency || 'usd'}></sc-format-number>
        </sc-line-item>

        {(state?.line_item?.fees?.data || []).map(fee => {
          return (
            <sc-line-item>
              <span slot="description">{fee.description}</span>
              <sc-format-number slot="price" type="currency" value={fee.amount} currency={state?.line_item?.price?.currency || 'usd'}></sc-format-number>
            </sc-line-item>
          );
        })}

        {!!state.line_item?.tax_amount && (
          <sc-line-item>
            <span slot="description">{__('Tax', 'surecart')}</span>
            <sc-format-number slot="price" type="currency" value={state.line_item?.tax_amount} currency={state?.line_item?.price?.currency || 'usd'}></sc-format-number>
          </sc-line-item>
        )}

        <sc-divider></sc-divider>

        <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
          <span slot="title">{__('Total', 'surecart')}</span>
          <sc-format-number slot="price" type="currency" value={state.line_item?.total_amount} currency={state?.line_item?.price?.currency || 'usd'}></sc-format-number>
        </sc-line-item>

        {state.amount_due !== state.line_item?.total_amount && (
          <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
            <span slot="title">{__('Amount Due', 'surecart')}</span>
            <span slot="price">
              {<sc-format-number slot="price" type="currency" value={state.amount_due} currency={state?.line_item?.price?.currency || 'usd'}></sc-format-number>}
            </span>
          </sc-line-item>
        )}
      </sc-summary>
    );
  }
}
