import { Component, Element, Fragment, h, Prop, State } from '@stencil/core';
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { intervalString } from '../../../../functions/price';
import { Checkout, Order, Product } from '../../../../types';

@Component({
  tag: 'sc-order',
  styleUrl: 'sc-order.scss',
  shadow: true,
})
export class ScOrder {
  @Element() el: HTMLScOrdersListElement;
  @Prop() orderId: string;
  @Prop() heading: string;

  @State() order: Order;

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  /** Only fetch if visible */
  componentDidLoad() {
    onFirstVisible(this.el, () => {
      this.initialFetch();
    });
  }

  async initialFetch() {
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

  async fetchOrder() {
    try {
      this.busy = true;
      await this.getOrder();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get order */
  async getOrder() {
    this.order = (await await apiFetch({
      path: addQueryArgs(`surecart/v1/orders/${this.orderId}`, {
        expand: ['checkout', 'checkout.purchases', 'purchase.product', 'product', 'product.downloads', 'download.media', 'checkout.line_items', 'checkout.payment_method', 'payment_method.card', 'payment_method.bank_account', 'line_item.price', 'price.product', 'charge'],
      }),
    })) as Order;
  }

  renderLoading() {
    return (
      <sc-flex flexDirection='column' style={{ 'gap': '1em' }}>
        <sc-skeleton style={{ width: '20%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '60%', display: 'inline-block' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%', display: 'inline-block' }}></sc-skeleton>
      </sc-flex>
    );
  }

  renderEmpty() {
    return (
      <sc-empty icon="shopping-bag">{__("Order not found.", 'surecart')}</sc-empty>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.order?.id) {
      return this.renderEmpty();
    }

    const checkout = this.order?.checkout as Checkout;

    return <Fragment>
      {(checkout?.line_items?.data || []).map((item) => {
        return (
          <sc-product-line-item
            key={item.id}
            imageUrl={item?.price?.metadata?.wp_attachment_src}
            name={(item?.price?.product as Product)?.name}
            editable={false}
            removable={false}
            quantity={item.quantity}
            amount={item.subtotal_amount}
            currency={item?.price?.currency}
            trialDurationDays={item?.price?.trial_duration_days}
            interval={intervalString(item?.price)}
          ></sc-product-line-item>
        );
      })}

      <sc-divider style={{ '--spacing': 'var(--sc-spacing-x-small)' }}></sc-divider>

      <sc-line-item>
        <span slot="description">{__('Subtotal', 'surecart')}</span>
        <sc-format-number
          slot="price"
          style={{
            'font-weight': 'var(--sc-font-weight-semibold)',
            color: 'var(--sc-color-gray-800)',
          }}
          type="currency"
          currency={checkout?.currency}
          value={checkout?.subtotal_amount}
        ></sc-format-number>
      </sc-line-item>

      {!!checkout?.proration_amount && <sc-line-item>
        <span slot="description">{__('Proration', 'surecart')}</span>
        <sc-format-number
          slot="price"
          style={{
            'font-weight': 'var(--sc-font-weight-semibold)',
            color: 'var(--sc-color-gray-800)',
          }}
          type="currency"
          currency={checkout?.currency}
          value={checkout?.proration_amount}
        ></sc-format-number>
      </sc-line-item>}

      {!!checkout?.applied_balance_amount && <sc-line-item>
        <span slot="description">{__('Applied Balance', 'surecart')}</span>
        <sc-format-number
          slot="price"
          style={{
            'font-weight': 'var(--sc-font-weight-semibold)',
            color: 'var(--sc-color-gray-800)',
          }}
          type="currency"
          currency={checkout?.currency}
          value={checkout?.applied_balance_amount}
        ></sc-format-number>
      </sc-line-item>}

      {!!checkout?.discounts && <sc-line-item>
        <span slot="description">{__('Discount', 'surecart')}</span>
        <sc-format-number
          slot="price"
          style={{
            'font-weight': 'var(--sc-font-weight-semibold)',
            color: 'var(--sc-color-gray-800)',
          }}
          type="currency"
          currency={checkout?.currency}
          value={checkout?.discounts}
        ></sc-format-number>
      </sc-line-item>}

      {!!checkout?.tax_amount && <sc-line-item>
        <span slot="description">{__('Tax', 'surecart')}</span>
        <sc-format-number
          slot="price"
          style={{
            'font-weight': 'var(--sc-font-weight-semibold)',
            color: 'var(--sc-color-gray-800)',
          }}
          type="currency"
          currency={checkout?.currency}
          value={checkout?.tax_amount}
        ></sc-format-number>
      </sc-line-item>}

      <sc-divider style={{ '--spacing': 'var(--sc-spacing-x-small)' }}></sc-divider>

      <sc-line-item
        style={{
          width: '100%',
          '--price-size': 'var(--sc-font-size-x-large)',
        }}
      >
        <span slot="title">{__('Total', 'surecart')}</span>
        <span slot="price">
          <sc-format-number
            type="currency"
            currency={checkout?.currency}
            value={checkout?.amount_due}
          ></sc-format-number>
        </span>
        <span slot="currency">{checkout?.currency}</span>
      </sc-line-item>

    </Fragment>
  }

  render() {
    const checkout = this?.order?.checkout as Checkout;
    return (
      <sc-spacing style={{ '--spacing': 'var(--sc-spacing-large)' }}>
        <sc-dashboard-module error={this.error}>

          <span slot="heading">{this.loading ? <sc-skeleton style={{ 'width': '120px' }}></sc-skeleton> : `#${this?.order?.number}`}</span>
          {!this.loading && !checkout?.live_mode && <sc-tag type="warning" slot="end">{__('Test Mode', 'surecart')}</sc-tag>}

          <sc-card no-padding={!this.loading}>
            {this.loading ? this.renderLoading() :
              <sc-stacked-list>
                <sc-stacked-list-row style={{ '--columns': '2' }}>
                  <div>{__('Order Status', 'surecart')}</div>
                  <sc-order-status-badge status={this?.order?.status}></sc-order-status-badge>
                </sc-stacked-list-row>
                <sc-stacked-list-row style={{ '--columns': '2' }}>
                  <div>{__('Date', 'surecart')}</div>
                  <sc-format-date type="timestamp" date={this.order?.created_at} month="short" day="numeric" year="numeric"></sc-format-date>
                </sc-stacked-list-row>

                <sc-stacked-list-row style={{ '--columns': '2' }}>
                  <div>{__('Payment Method', 'surecart')}</div>
                  <sc-payment-method paymentMethod={checkout?.payment_method}></sc-payment-method>
                </sc-stacked-list-row>
              </sc-stacked-list>
            }
          </sc-card>

        </sc-dashboard-module>


        {this.order?.pdf_url && <sc-button type="primary" href={this.order?.pdf_url} target="_blank">
          <sc-icon name="inbox" slot="prefix"></sc-icon>
          {__('Download Receipt/Invoice', 'surecart')}
        </sc-button>}

        {!!(this.order?.checkout as Checkout)?.purchases?.data?.length &&
          <sc-purchase-downloads-list heading={__('Downloads', 'surecart')} purchases={(this.order?.checkout as Checkout)?.purchases?.data}></sc-purchase-downloads-list>}

      </sc-spacing>
    );
  }
}
