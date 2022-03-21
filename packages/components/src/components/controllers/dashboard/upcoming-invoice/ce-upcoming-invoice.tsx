import { Component, Element, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '../../../../functions/fetch';
import { Invoice, PaymentMethod, Price, Product, Subscription } from '../../../../types';
import { translatedInterval } from '../../../../functions/price';
import { onFirstVisible } from '../../../../functions/lazy';
import { addQueryArgs } from '@wordpress/url';
import { capitalize } from '../../../../functions/util';

@Component({
  tag: 'ce-upcoming-invoice',
  styleUrl: 'ce-upcoming-invoice.scss',
  shadow: true,
})
export class CeUpcomingInvoice {
  @Element() el: HTMLCeUpcomingInvoiceElement;

  @Prop() heading: string;
  @Prop() successUrl: string;
  @Prop() subscriptionId: string;
  @Prop() priceId: string;
  @Prop() quantity: number;
  @Prop({ mutable: true }) discount: {
    promotion_code?: string;
    coupon?: string;
  };
  @Prop({ mutable: true }) payment_method: PaymentMethod;

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;
  @State() price: Price;
  @State() invoice: Invoice;
  @State() couponError: string;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.fetchItems();
    });
  }

  isFutureInvoice() {
    return this.invoice.period_start_at >= new Date().getTime() / 1000;
  }

  async fetchItems() {
    try {
      this.loading = true;
      await Promise.all([this.getInvoice(), this.getPrice()]);
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async getPrice() {
    if (!this.priceId) return;
    this.price = (await apiFetch({
      path: addQueryArgs(`checkout-engine/v1/prices/${this.priceId}`, {
        expand: ['product'],
      }),
    })) as Price;
  }

  async getInvoice() {
    if (!this.subscriptionId) return;
    this.invoice = (await apiFetch({
      path: addQueryArgs(`checkout-engine/v1/subscriptions/${this.subscriptionId}/upcoming_invoice/`, {
        expand: ['invoice.subscription', 'subscription.payment_method', 'payment_method.card', 'invoice.discount'],
        subscription: {
          price: this.priceId,
          quantity: this.quantity,
          ...(this.discount ? { discount: this.discount } : {}),
        },
      }),
    })) as Invoice;
    return this.invoice;
  }

  async applyCoupon(e) {
    try {
      this.couponError = '';
      this.busy = true;
      this.discount = {
        promotion_code: e.detail,
      };
      await this.getInvoice();
    } catch (e) {
      this.couponError = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  async updateQuantity(e) {
    try {
      this.error = '';
      this.busy = true;
      this.quantity = e.detail;
      await this.getInvoice();
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  async onSubmit() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `checkout-engine/v1/subscriptions/${this.subscriptionId}`,
        method: 'PATCH',
        data: {
          price: this.priceId,
          quantity: this.quantity,
          ...(this.discount ? { discount: this.discount } : {}),
        },
      });
      if (this.successUrl) {
        window.location.assign(this.successUrl);
      } else {
        this.busy = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.busy = false;
    }
  }

  renderName(price: Price) {
    if (typeof price?.product !== 'string') {
      return price?.product?.name;
    }
    return __('Plan', 'surecart');
  }

  renderRenewalText() {
    if (this.isFutureInvoice()) {
      return (
        <div>
          {__("You'll be switched to this plan", 'surecart')}{' '}
          <strong>
            {__('at the end of your billing cycle on', 'surecart')}{' '}
            <ce-format-date type="timestamp" date={this.invoice?.period_start_at} month="short" day="numeric" year="numeric"></ce-format-date>
          </strong>
        </div>
      );
    }

    return (
      <div>
        {__("You'll be switched to this plan", 'surecart')} <strong>{__('immediately', 'surecart')}</strong>
      </div>
    );
  }

  renderEmpty() {
    return <slot name="empty">{__('Something went wrong.', 'surecart')}</slot>;
  }

  renderLoading() {
    return (
      <div>
        <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
        <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
        <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
      </div>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.invoice) {
      return this.renderEmpty();
    }

    return (
      <div>
        <ce-text style={{ '--font-weight': 'var(--ce-font-weight-bold)' }}>{this.renderName(this.price)}</ce-text>
        <ce-format-number type="currency" currency={(this?.price as Price)?.currency} value={(this?.price as Price)?.amount}></ce-format-number>
        {translatedInterval(this?.price?.recurring_interval_count || 0, this?.price?.recurring_interval, ' /', '')}
        <div style={{ fontSize: 'var(--ce-font-size-small)' }}>{this.renderRenewalText()}</div>
      </div>
    );
  }

  renderPrice(key: string) {
    return <ce-format-number type="currency" currency={this.invoice.currency} value={this.invoice?.[key]}></ce-format-number>;
  }

  renderSummary() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.invoice) {
      return this.renderEmpty();
    }

    const { card } = (this.invoice.subscription as Subscription).payment_method as PaymentMethod;

    return (
      <Fragment>
        <ce-product-line-item
          imageUrl={(this.price?.product as Product)?.image_url}
          name={(this.price?.product as Product)?.name}
          editable={true}
          removable={false}
          quantity={1}
          amount={this.price.amount}
          currency={this.invoice?.currency}
          interval={translatedInterval(this.price.recurring_interval_count, this.price.recurring_interval)}
          onCeUpdateQuantity={e => this.updateQuantity(e)}
        ></ce-product-line-item>

        <ce-line-item>
          <span slot="description">{__('Subtotal', 'surecart')}</span>
          <span slot="price">{this.renderPrice('subtotal_amount')}</span>
        </ce-line-item>

        <ce-coupon-form label={__('Add Coupon Code')} onCeApplyCoupon={e => this.applyCoupon(e)} error={this.couponError}>
          {__('Add Coupon Code')}
        </ce-coupon-form>

        {!!this.invoice.tax_amount && (
          <ce-line-item>
            <span slot="description">{this.invoice?.tax_label || __('Tax', 'surecart')}</span>
            <span slot="price">{this.renderPrice('tax_amount')}</span>
          </ce-line-item>
        )}

        {this.invoice.total_amount !== this.invoice.amount_due && (
          <Fragment>
            <ce-divider style={{ '--spacing': '0' }}></ce-divider>

            <ce-line-item>
              <span slot="title">{__('Total', 'surecart')}</span>
              <span slot="price">{this.renderPrice('total_amount')}</span>
            </ce-line-item>

            {!!this.invoice.proration_amount && (
              <ce-line-item>
                <span slot="description">{__('Proration Credit', 'surecart')}</span>
                <span slot="price">{this.renderPrice('proration_amount')}</span>
              </ce-line-item>
            )}
          </Fragment>
        )}

        <ce-divider style={{ '--spacing': '0' }}></ce-divider>

        <ce-line-item>
          <span slot="description">{__('Payment', 'surecart')}</span>
          <a
            href={addQueryArgs(window.location.href, {
              action: 'payment',
            })}
            slot="price-description"
          >
            <ce-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
              {capitalize(card?.brand)}
              <span style={{ fontSize: '7px', whiteSpace: 'nowrap' }}>
                {'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
              </span>
              <span>{card?.last4}</span>
              <ce-icon name="edit-3"></ce-icon>
            </ce-flex>
          </a>
        </ce-line-item>

        <ce-line-item style={{ '--price-size': 'var(--ce-font-size-x-large)' }}>
          <span slot="title">{__('Total Due Today', 'surecart')}</span>
          {this.isFutureInvoice() ? (
            <ce-format-number type="currency" currency={this.invoice?.currency} slot="price"></ce-format-number>
          ) : (
            <span slot="price">{this.renderPrice('amount_due')}</span>
          )}
          <span slot="currency">{this.invoice.currency}</span>
        </ce-line-item>
      </Fragment>
    );
  }

  render() {
    return (
      <div class="upcoming-invoice">
        {this.error && (
          <ce-alert open={!!this.error} type="danger">
            <span slot="title">{__('Error', 'surecart')}</span>
            {this.error}
          </ce-alert>
        )}

        <ce-dashboard-module heading={__('New Plan', 'surecart')} class="plan-preview" error={this.error}>
          <ce-card>{this.renderContent()}</ce-card>
        </ce-dashboard-module>

        <ce-dashboard-module heading={__('Summary', 'surecart')} class="plan-summary">
          <ce-form onCeFormSubmit={() => this.onSubmit()}>
            <ce-card>{this.renderSummary()}</ce-card>

            <ce-button type="primary" full submit loading={this.loading || this.busy} disabled={this.loading || this.busy}>
              {__('Confirm', 'surecart')}
            </ce-button>
          </ce-form>
        </ce-dashboard-module>

        <ce-text style={{ '--text-align': 'center', '--font-size': 'var(--ce-font-size-small)', '--line-height': 'var(--ce-line-height-normal)' }}>
          <slot name="terms"></slot>
        </ce-text>

        {this.busy && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}
