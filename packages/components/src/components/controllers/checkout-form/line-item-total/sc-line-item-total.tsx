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
import { Checkout } from '../../../../types';

@Component({
  tag: 'sc-line-item-total',
  styleUrl: 'sc-line-item-total.scss',
  shadow: true,
})
export class ScLineItemTotal {
  @Prop() total: 'total' | 'subtotal' = 'total';
  @Prop() size: 'large' | 'medium';
  @Prop() checkout: Checkout;

  order_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
    amount_due: 'amount_due',
  };

  hasInstallmentPlan(checkout: Checkout) {
    return checkout?.full_amount !== checkout?.subtotal_amount;
  }

  hasSubscription(checkout: Checkout) {
    return (checkout?.line_items?.data || []).some(
      lineItem => lineItem?.price?.recurring_interval === 'month' && !!lineItem?.price?.recurring_interval && !lineItem?.price?.recurring_period_count,
    );
  }

  renderLineItemTitle(checkout: Checkout) {
    if (this.total === 'total' && this.hasInstallmentPlan(checkout)) {
      return (
        <span slot="title">
          <slot name="first-payment-total-description">{__('Subtotal', 'surecart')}</slot>
        </span>
      );
    }

    return (
      <span slot="title">
        <slot name="title" />
      </span>
    );
  }

  renderLineItemDescription(checkout: Checkout) {
    if (this.total === 'subtotal' && this.hasInstallmentPlan(checkout)) {
      return (
        <span slot="description">
          <slot name="first-payment-subtotal-description">{__('Initial Payment', 'surecart')}</slot>
        </span>
      );
    }

    return (
      <span slot="description">
        <slot name="description" />
      </span>
    );
  }

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    // loading state
    if (formBusy() && !checkout?.[this?.order_key?.[this?.total]]) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', 'height': this.size === 'large' ? '40px' : '', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    if (!checkout?.currency) return;

    // if the total amount is different than the amount due.
    if (this.total === 'total' && checkout?.total_amount !== checkout?.amount_due) {
      return (
        <div class="line-item-total__group">
          <sc-line-item>
            <span slot="description">
              {this.hasInstallmentPlan(checkout) ? (
                this.renderLineItemTitle(checkout)
              ) : (
                <Fragment>
                  <slot name="title" />
                  <slot name="description" />
                </Fragment>
              )}
            </span>
            <span slot="price">
              <sc-total order={checkout} total={this.total}></sc-total>
            </span>
          </sc-line-item>

          {!!checkout.trial_amount && (
            <sc-line-item>
              <span slot="description">
                <slot name="free-trial-description">{__('Trial', 'surecart')}</slot>
              </span>
              <span slot="price">
                <sc-format-number type="currency" value={checkout.trial_amount} currency={checkout.currency} />
              </span>
            </sc-line-item>
          )}

          <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
            {this.hasSubscription(checkout) ? (
              <span slot="title">
                <slot name="subscription-title">{__('Total Due Today', 'surecart')}</slot>
              </span>
            ) : (
              <span slot="title">
                <slot name="due-amount-description">{__('Amount Due', 'surecart')}</slot>
              </span>
            )}

            <span slot="price">
              <sc-format-number type="currency" currency={checkout?.currency} value={checkout?.amount_due}></sc-format-number>
            </span>
          </sc-line-item>
        </div>
      );
    }

    return (
      <Fragment>
        {this.total === 'subtotal' && this.hasInstallmentPlan(checkout) && (
          <sc-line-item style={this.size === 'large' ? { '--price-size': 'var(--sc-font-size-x-large)' } : {}}>
            <span slot="description">
              <slot name="total-payments-description">{__('Total Installment Payments', 'surecart')}</slot>
            </span>
            <span slot="price">
              <sc-format-number type="currency" value={checkout?.full_amount} currency={checkout?.currency || 'usd'} />
            </span>
          </sc-line-item>
        )}

        <sc-line-item style={this.size === 'large' ? { '--price-size': 'var(--sc-font-size-x-large)' } : {}}>
          {this.renderLineItemTitle(checkout)}
          {this.renderLineItemDescription(checkout)}
          <span slot="price">
            {!!checkout?.total_savings_amount && this.total === 'total' && <span class="scratch-price">{checkout?.total_scratch_display_amount}</span>}
            <sc-total class="total-price" order={checkout} total={this.total}></sc-total>
          </span>
        </sc-line-item>
      </Fragment>
    );
  }
}
