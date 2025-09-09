import { getHumanDiscount } from '../../../../functions/price';
import { Checkout, ShippingChoice, ShippingMethod } from '../../../../types';
import { Component, h, Prop, Fragment } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { formatTaxDisplay } from '../../../../functions/tax';

@Component({
  tag: 'sc-order-confirmation-totals',
  styleUrl: 'sc-order-confirmation-totals.css',
  shadow: true,
})
export class ScOrderConfirmationTotals {
  @Prop() order: Checkout;

  renderDiscountLine() {
    if (!this.order?.discount?.promotion?.code) {
      return null;
    }

    let humanDiscount = '';

    if (this.order?.discount?.coupon) {
      humanDiscount = getHumanDiscount(this.order?.discount?.coupon);
    }

    return (
      <sc-line-item style={{ marginTop: 'var(--sc-spacing-small)' }}>
        <span slot="description">
          {__('Discount', 'surecart')}
          <br />
          {this.order?.discount?.promotion?.code && (
            <sc-tag type="success" size="small">
              {this.order?.discount?.promotion?.code}
            </sc-tag>
          )}
        </span>
        {humanDiscount && (
          <span class="coupon-human-discount" slot="price-description">
            ({humanDiscount})
          </span>
        )}
        <span slot="price">
          {this.order?.discounts_display_amount}
        </span>
      </sc-line-item>
    );
  }

  render() {
    const shippingMethod = (this.order?.selected_shipping_choice as ShippingChoice)?.shipping_method as ShippingMethod;
    const shippingMethodName = shippingMethod?.name;
    return (
      <div class={{ 'line-item-totals': true }}>
        {this.order?.subtotal_amount !== this.order?.total_amount && (
          <sc-line-item>
            <span slot="description">{__('Subtotal', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.subtotal_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.trial_amount && (
          <sc-line-item>
            <span slot="description">{__('Trial', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.trial_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.discounts && (
          <sc-line-item>
            <span slot="description">{__('Discounts', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.discounts_display}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.discount?.promotion?.code && (
          <sc-line-item>
            <span slot="description">
              {__('Discount', 'surecart')}
              <br />
              <sc-tag type="success">
                {__('Coupon:', 'surecart')} {this.order?.discount?.promotion?.code}
              </sc-tag>
            </span>

            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.discounts_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.shipping_amount && (
          <sc-line-item>
            <span slot="description">{`${__('Shipping', 'surecart')} ${shippingMethodName ? `(${shippingMethodName})` : ''}`}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.shipping_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.tax_amount && (
          <sc-line-item>
            <span slot="description">{`${formatTaxDisplay(this.order?.tax_label, this.order?.tax_status === 'estimated')} (${this.order?.tax_percent}%)`}</span>
            <span slot="price">{this.order?.tax_display_amount}</span>
            {!!this.order?.tax_inclusive_amount && <span slot="price-description">{`(${__('included', 'surecart')})`}</span>}
          </sc-line-item>
        )}

        <sc-divider style={{ '--spacing': 'var(--sc-spacing-x-small)' }}></sc-divider>

        <sc-line-item
          style={{
            'width': '100%',
            '--price-size': 'var(--sc-font-size-x-large)',
          }}
        >
          <span slot="title">{__('Total', 'surecart')}</span>
          <span slot="price">{this.order?.total_display_amount}</span>
          <span slot="currency">{this.order?.currency}</span>
        </sc-line-item>

        {!!this.order?.proration_amount && (
          <sc-line-item>
            <span slot="description">{__('Proration', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.proration_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.applied_balance_amount && (
          <sc-line-item>
            <span slot="description">{__('Applied Balance', 'surecart')}</span>
            <span
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
              slot="price"
            >
              {this.order?.applied_balance_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!this.order?.credited_balance_amount && (
          <sc-line-item>
            <span slot="description">{__('Credited Balance', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {this.order?.credited_balance_display_amount}
            </span>
          </sc-line-item>
        )}

        {this.order?.amount_due !== this.order?.total_amount && (
          <sc-line-item
            style={{
              'width': '100%',
              '--price-size': 'var(--sc-font-size-x-large)',
            }}
          >
            <span slot="title">{__('Amount Due', 'surecart')}</span>
            <span slot="price">{this.order?.amount_due_display_amount}</span>
            <span slot="currency">{this.order?.currency}</span>
          </sc-line-item>
        )}
        <sc-divider style={{ '--spacing': 'var(--sc-spacing-x-small)' }}></sc-divider>

        {!!this.order?.paid_amount && (
          <sc-line-item
            style={{
              'width': '100%',
              '--price-size': 'var(--sc-font-size-x-large)',
            }}
          >
            <span slot="title">{__('Paid', 'surecart')}</span>
            <span slot="price">{this.order?.paid_display_amount}</span>
            <span slot="currency">{this.order?.currency}</span>
          </sc-line-item>
        )}
        {!!this.order?.refunded_amount && (
          <Fragment>
            <sc-line-item
              style={{
                'width': '100%',
                '--price-size': 'var(--sc-font-size-x-large)',
              }}
            >
              <span slot="description">{__('Refunded', 'surecart')}</span>
              <span slot="price">{this.order?.refunded_display_amount}</span>
            </sc-line-item>
            <sc-line-item
              style={{
                'width': '100%',
                '--price-size': 'var(--sc-font-size-x-large)',
              }}
            >
              <span slot="title">{__('Net Payment', 'surecart')}</span>
              <span slot="price">{this.order?.net_paid_display_amount}</span>
            </sc-line-item>
          </Fragment>
        )}
        {this.order?.tax_reverse_charged_amount > 0 && (
          <sc-line-item>
            <span slot="description">{__('*Tax to be paid on reverse charge basis', 'surecart')}</span>
          </sc-line-item>
        )}
      </div>
    );
  }
}

openWormhole(ScOrderConfirmationTotals, ['order', 'busy', 'loading', 'empty'], false);
