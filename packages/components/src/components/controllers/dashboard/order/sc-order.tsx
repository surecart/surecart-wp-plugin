import { Component, Element, Fragment, h, Prop, State } from '@stencil/core';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { intervalString } from '../../../../functions/price';
import { formatTaxDisplay } from '../../../../functions/tax';
import { Checkout, ManualPaymentMethod, Order, Product, Purchase, ShippingChoice, ShippingMethod } from '../../../../types';

@Component({
  tag: 'sc-order',
  styleUrl: 'sc-order.scss',
  shadow: true,
})
export class ScOrder {
  @Element() el: HTMLScOrdersListElement;
  @Prop() orderId: string;
  @Prop() customerIds: string[];
  @Prop() heading: string;

  @State() order: Order;
  @State() purchases: Purchase[];

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  /** Only fetch if visible */
  componentDidLoad() {
    onFirstVisible(this.el, () => {
      this.fetchOrder();
      this.fetchDownloads();
    });
  }

  async fetchOrder() {
    try {
      this.loading = true;
      await this.getOrder();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchDownloads() {
    try {
      this.busy = true;
      this.purchases = (await apiFetch({
        path: addQueryArgs(`surecart/v1/purchases`, {
          expand: ['product', 'product.downloads', 'download.media'],
          order_ids: [this.orderId],
          customer_ids: this.customerIds,
          downloadable: true,
        }),
      })) as Purchase[];
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get order */
  async getOrder() {
    this.order = (await apiFetch({
      path: addQueryArgs(`surecart/v1/orders/${this.orderId}`, {
        expand: [
          'checkout',
          'checkout.line_items',
          'line_item.price',
          'line_item.fees',
          'line_item.variant',
          'variant.image',
          'price.product',
          'checkout.manual_payment_method',
          'checkout.payment_method',
          'checkout.selected_shipping_choice',
          'shipping_choice.shipping_method',
          'payment_method.card',
          'payment_method.payment_instrument',
          'payment_method.paypal_account',
          'payment_method.bank_account',
          'checkout.discount',
          'discount.promotion',
          'checkout.charge',
        ],
      }),
    })) as Order;
  }

  renderLoading() {
    return (
      <sc-flex flexDirection="column" style={{ gap: '1em' }}>
        <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
      </sc-flex>
    );
  }

  renderEmpty() {
    return <sc-empty icon="shopping-bag">{__('Order not found.', 'surecart')}</sc-empty>;
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.order?.id) {
      return this.renderEmpty();
    }

    const checkout = this.order?.checkout as Checkout;
    const shippingMethod = (checkout?.selected_shipping_choice as ShippingChoice)?.shipping_method as ShippingMethod;
    const shippingMethodName = shippingMethod?.name;

    return (
      <Fragment>
        {(checkout?.line_items?.data || []).map(item => {
          return (
            <sc-product-line-item
              key={item.id}
              image={item?.image}
              name={(item?.price?.product as Product)?.name}
              priceName={item?.price?.name}
              variantLabel={(item?.variant_options || []).filter(Boolean).join(' / ') || null}
              editable={false}
              removable={false}
              quantity={item.quantity}
              scratchDisplayAmount={item?.scratch_display_amount}
              displayAmount={item?.subtotal_display_amount}
              amount={item.subtotal_amount}
              currency={item?.price?.currency}
              trialDurationDays={item?.price?.trial_duration_days}
              interval={intervalString(item?.price)}
              scratchAmount={item?.scratch_amount}
              setupFeeTrialEnabled={item?.price?.setup_fee_trial_enabled}
              fees={item?.fees?.data}
            />
          );
        })}

        {checkout?.subtotal_amount !== checkout?.total_amount && (
          <sc-line-item>
            <span slot="description">{__('Subtotal', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.subtotal_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.trial_amount && (
          <sc-line-item>
            <span slot="description">{__('Trial', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.trial_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.discounts && (
          <sc-line-item>
            <span slot="description">{__('Discounts', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.discounts_display}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.discount?.promotion?.code && (
          <sc-line-item>
            <span slot="description">
              {__('Discount', 'surecart')}
              <br />
              <sc-tag type="success">
                {__('Coupon:', 'surecart')} {checkout?.discount?.promotion?.code}
              </sc-tag>
            </span>

            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.discounts_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.shipping_amount && (
          <sc-line-item>
            <span slot="description">{`${__('Shipping', 'surecart')} ${shippingMethodName ? `(${shippingMethodName})` : ''}`}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.shipping_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.tax_amount && (
          <sc-line-item>
            <span slot="description">{`${formatTaxDisplay(checkout?.tax_label, checkout?.tax_status === 'estimated')} (${checkout?.tax_percent}%)`}</span>
            <span slot="price">{checkout?.tax_display_amount}</span>
            {!!checkout?.tax_inclusive_amount && <span slot="price-description">{`(${__('included', 'surecart')})`}</span>}
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
          <span slot="price">{checkout?.total_display_amount}</span>
          <span slot="currency">{checkout?.currency}</span>
        </sc-line-item>

        {!!checkout?.proration_amount && (
          <sc-line-item>
            <span slot="description">{__('Proration', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.proration_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.applied_balance_amount && (
          <sc-line-item>
            <span slot="description">{__('Applied Balance', 'surecart')}</span>
            <span
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
              slot="price"
            >
              {checkout?.applied_balance_display_amount}
            </span>
          </sc-line-item>
        )}

        {!!checkout?.credited_balance_amount && (
          <sc-line-item>
            <span slot="description">{__('Credited Balance', 'surecart')}</span>
            <span
              slot="price"
              style={{
                'font-weight': 'var(--sc-font-weight-semibold)',
                'color': 'var(--sc-color-gray-800)',
              }}
            >
              {checkout?.credited_balance_display_amount}
            </span>
          </sc-line-item>
        )}

        {checkout?.amount_due !== checkout?.total_amount && (
          <sc-line-item
            style={{
              'width': '100%',
              '--price-size': 'var(--sc-font-size-x-large)',
            }}
          >
            <span slot="title">{__('Amount Due', 'surecart')}</span>
            <span slot="price">{checkout?.amount_due_display_amount}</span>
            <span slot="currency">{checkout?.currency}</span>
          </sc-line-item>
        )}
        <sc-divider style={{ '--spacing': 'var(--sc-spacing-x-small)' }}></sc-divider>

        {!!checkout?.paid_amount && (
          <sc-line-item
            style={{
              'width': '100%',
              '--price-size': 'var(--sc-font-size-x-large)',
            }}
          >
            <span slot="title">{__('Paid', 'surecart')}</span>
            <span slot="price">{checkout?.paid_display_amount}</span>
            <span slot="currency">{checkout?.currency}</span>
          </sc-line-item>
        )}
        {!!checkout?.refunded_amount && (
          <Fragment>
            <sc-line-item
              style={{
                'width': '100%',
                '--price-size': 'var(--sc-font-size-x-large)',
              }}
            >
              <span slot="description">{__('Refunded', 'surecart')}</span>
              <span slot="price">{checkout?.refunded_display_amount}</span>
            </sc-line-item>
            <sc-line-item
              style={{
                'width': '100%',
                '--price-size': 'var(--sc-font-size-x-large)',
              }}
            >
              <span slot="title">{__('Net Payment', 'surecart')}</span>
              <span slot="price">{checkout?.net_paid_display_amount}</span>
            </sc-line-item>
          </Fragment>
        )}
        {checkout?.tax_reverse_charged_amount > 0 && (
          <sc-line-item>
            <span slot="description">{__('*Tax to be paid on reverse charge basis', 'surecart')}</span>
          </sc-line-item>
        )}
      </Fragment>
    );
  }

  render() {
    const checkout = this?.order?.checkout as Checkout;
    const manualPaymentMethod = checkout?.manual_payment_method as ManualPaymentMethod;
    return (
      <sc-spacing style={{ '--spacing': 'var(--sc-spacing-large)' }}>
        <sc-dashboard-module error={this.error}>
          <span slot="heading">{this.loading ? <sc-skeleton style={{ width: '120px' }}></sc-skeleton> : `#${this?.order?.number}`}</span>
          {!this.loading && !checkout?.live_mode && (
            <sc-tag type="warning" slot="end">
              {__('Test Mode', 'surecart')}
            </sc-tag>
          )}

          {!!manualPaymentMethod?.name && !!manualPaymentMethod?.instructions && (
            <sc-order-manual-instructions manualPaymentTitle={manualPaymentMethod?.name} manualPaymentInstructions={manualPaymentMethod?.instructions} />
          )}

          <sc-card no-padding={!this.loading}>
            {this.loading ? (
              this.renderLoading()
            ) : (
              <Fragment>
                <sc-stacked-list>
                  <sc-stacked-list-row style={{ '--columns': '2' }}>
                    <div>{__('Order Status', 'surecart')}</div>
                    <sc-order-status-badge status={this?.order?.status}></sc-order-status-badge>
                  </sc-stacked-list-row>
                  <sc-stacked-list-row style={{ '--columns': '2' }}>
                    <div>{__('Date', 'surecart')}</div>
                    <span>{this.order?.created_at_date}</span>
                  </sc-stacked-list-row>

                  <sc-stacked-list-row style={{ '--columns': '2' }}>
                    <div>{__('Payment Method', 'surecart')}</div>
                    <sc-payment-method paymentMethod={checkout?.payment_method}></sc-payment-method>
                  </sc-stacked-list-row>

                  <div class="order__row">{this.renderContent()}</div>
                </sc-stacked-list>
              </Fragment>
            )}
          </sc-card>
        </sc-dashboard-module>

        {this.order?.statement_url && (
          <sc-button type="primary" href={this.order?.statement_url} target="_blank">
            <sc-icon name="inbox" slot="prefix"></sc-icon>
            {__('Download Receipt/Invoice', 'surecart')}
          </sc-button>
        )}

        {!!this.purchases?.length && <sc-purchase-downloads-list heading={__('Downloads', 'surecart')} purchases={this.purchases}></sc-purchase-downloads-list>}
      </sc-spacing>
    );
  }
}
