import { Component, h, Prop, State, Host, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { formatTaxDisplay } from '../../../../functions/tax';
import { Checkout, Period, Product, ResponseError, Subscription, ManualPaymentMethod } from '../../../../types';

@Component({
  tag: 'sc-subscription-next-payment',
  shadow: true,
})
export class ScSubscriptionNextPayment {
  @Prop() subscription: Subscription;
  /** Update the payment method url */
  @Prop() updatePaymentMethodUrl: string;

  @State() period: Period;
  @State() loading: boolean = true;
  @State() error: ResponseError;
  @State() details: boolean;

  componentWillLoad() {
    this.fetch();
  }

  @Watch('subscription')
  handleSubscriptionChange() {
    this.fetch();
  }

  async fetch() {
    if (this.subscription?.cancel_at_period_end && this.subscription.current_period_end_at) {
      this.loading = false;
      return;
    }
    if (this.subscription?.status === 'canceled') {
      this.loading = false;
      return;
    }
    try {
      this.loading = true;
      this.period = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscription?.id}/upcoming_period`, {
          skip_product_group_validation: true,
          expand: [
            'period.checkout',
            'checkout.line_items',
            'checkout.payment_method',
            'checkout.manual_payment_method',
            'payment_method.card',
            'payment_method.payment_instrument',
            'payment_method.paypal_account',
            'payment_method.bank_account',
            'line_item.price',
            'price.product',
            'period.subscription',
          ],
        }),
        data: {
          purge_pending_update: false,
        },
      })) as Period;
    } catch (e) {
      console.error(e);
      this.error = e;
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return (
        <sc-toggle borderless disabled>
          <sc-flex slot="summary" flexDirection="column">
            <sc-skeleton style={{ width: '200px' }}></sc-skeleton>
            <sc-skeleton style={{ width: '400px' }}></sc-skeleton>
            <sc-skeleton style={{ width: '300px' }}></sc-skeleton>
          </sc-flex>
        </sc-toggle>
      );
    }

    const checkout = this?.period?.checkout as Checkout;
    if (!checkout)
      return (
        <div style={{ padding: 'var(--sc-spacing-medium)' }}>
          <sc-subscription-details slot="summary" subscription={this.subscription}></sc-subscription-details>
        </div>
      );

    const manualPaymentMethod = checkout?.manual_payment ? (checkout?.manual_payment_method as ManualPaymentMethod) : null;
    const paymentMethodExists = this?.subscription.payment_method || this?.subscription.manual_payment;

    return (
      <Host>
        <sc-toggle borderless shady>
          <span slot="summary">
            <sc-subscription-details subscription={this.subscription}>
              <div style={{ fontSize: 'var(--sc-font-size-small)' }}>
                {__('Your next payment is', 'surecart')} <strong>{checkout?.amount_due_display_amount}</strong>{' '}
                {!!this.subscription?.remaining_period_text && `— ${this.subscription?.remaining_period_text}`}
              </div>
            </sc-subscription-details>
          </span>

          <sc-card noPadding borderless>
            {checkout?.line_items?.data.map(item => (
              <sc-product-line-item
                image={(item.price?.product as Product)?.line_item_image}
                name={(item.price?.product as Product)?.name}
                price={item?.price?.name}
                variant={item?.variant_display_options}
                editable={false}
                removable={false}
                note={item?.display_note}
                scratchDisplayAmount={item?.scratch_display_amount}
                displayAmount={item?.subtotal_display_amount}
                quantity={item?.quantity}
                amount={item?.subtotal_display_amount}
                interval={`${item?.price?.short_interval_text} ${item?.price?.short_interval_count_text}`}
                purchasableStatus={item?.purchasable_status_display}
              ></sc-product-line-item>
            ))}

            <sc-line-item>
              <span slot="description">{__('Subtotal', 'surecart')}</span>
              {checkout?.subtotal_display_amount}
            </sc-line-item>

            {!!checkout.proration_amount && (
              <sc-line-item>
                <span slot="description">{__('Proration Credit', 'surecart')}</span>
                {checkout?.proration_display_amount}
              </sc-line-item>
            )}

            {!!checkout.applied_balance_amount && (
              <sc-line-item>
                <span slot="description">{__('Applied Balance', 'surecart')}</span>
                {checkout?.applied_balance_display_amount}
              </sc-line-item>
            )}

            {!!checkout.trial_amount && (
              <sc-line-item>
                <span slot="description">{__('Trial', 'surecart')}</span>
                {checkout?.trial_display_amount}
              </sc-line-item>
            )}

            {!!checkout?.discount_amount && (
              <sc-line-item>
                <span slot="description">{__('Discounts', 'surecart')}</span>
                {checkout?.discounts_display_amount}
              </sc-line-item>
            )}

            {!!checkout?.shipping_amount && (
              <sc-line-item style={{ marginTop: 'var(--sc-spacing-small)' }}>
                <span slot="description">{__('Shipping', 'surecart')}</span>
                {checkout?.shipping_display_amount}
              </sc-line-item>
            )}

            {!!checkout.tax_amount && (
              <sc-line-item>
                <span slot="description">{formatTaxDisplay(checkout?.tax_label)}</span>
                {checkout?.tax_display_amount}
              </sc-line-item>
            )}

            <sc-divider style={{ '--spacing': '0' }}></sc-divider>

            <sc-line-item>
              <span slot="description">{__('Payment', 'surecart')}</span>
              {paymentMethodExists && (
                <a href={this.updatePaymentMethodUrl} slot="price-description">
                  <sc-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
                    {manualPaymentMethod ? <sc-manual-payment-method paymentMethod={manualPaymentMethod} /> : <sc-payment-method paymentMethod={checkout?.payment_method} />}
                    <sc-icon name="edit-3"></sc-icon>
                  </sc-flex>
                </a>
              )}
              {!paymentMethodExists && (
                <a
                  href={addQueryArgs(window.location.href, {
                    action: 'create',
                    model: 'payment_method',
                    id: this?.subscription.id,
                    ...(this?.subscription?.live_mode === false ? { live_mode: false } : {}),
                  })}
                  slot="price-description"
                >
                  {__('Add Payment Method', 'surecart')}
                </a>
              )}
            </sc-line-item>

            <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
              <span slot="title">{__('Total Due', 'surecart')}</span>
              <span slot="price">{checkout?.amount_due_display_amount}</span>
              <span slot="currency">{checkout.currency}</span>
            </sc-line-item>
          </sc-card>
        </sc-toggle>
      </Host>
    );
  }
}
