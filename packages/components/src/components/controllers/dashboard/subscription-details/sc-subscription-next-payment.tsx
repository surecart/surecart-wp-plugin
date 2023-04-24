import { Component, h, Prop, State, Host, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { intervalString, translateRemainingPayments } from '../../../../functions/price';
import { formatTaxDisplay } from '../../../../functions/tax';
import { Checkout, Period, Product, ResponseError, Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-next-payment',
  shadow: true,
})
export class ScSubscriptionNextPayment {
  @Prop() subscription: Subscription;
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

    return (
      <Host>
        <sc-toggle borderless shady>
          <span slot="summary">
            <sc-subscription-details subscription={this.subscription}>
              <div style={{ fontSize: 'var(--sc-font-size-small)' }}>
                {__('Your next payment is', 'surecart')}{' '}
                <strong>
                  <sc-format-number type="currency" currency={checkout?.currency} value={checkout?.amount_due} />
                </strong>{' '}
                {!!this.subscription?.finite && ' - ' + translateRemainingPayments(this.subscription?.remaining_period_count)}
              </div>
            </sc-subscription-details>
          </span>

          <sc-card noPadding borderless>
            {checkout?.line_items?.data.map(item => (
              <sc-product-line-item
                imageUrl={(item.price?.product as Product)?.image_url}
                name={(item.price?.product as Product)?.name}
                editable={false}
                removable={false}
                quantity={item?.quantity}
                amount={item?.total_amount}
                currency={item?.price?.currency}
                interval={intervalString(item?.price)}
              ></sc-product-line-item>
            ))}

            <sc-line-item>
              <span slot="description">{__('Subtotal', 'surecart')}</span>
              <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={checkout?.subtotal_amount}></sc-format-number>
            </sc-line-item>

            {!!checkout.proration_amount && (
              <sc-line-item>
                <span slot="description">{__('Proration Credit', 'surecart')}</span>
                <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={-checkout?.proration_amount}></sc-format-number>
              </sc-line-item>
            )}

            {!!checkout.applied_balance_amount && (
              <sc-line-item>
                <span slot="description">{__('Applied Balance', 'surecart')}</span>
                <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={-checkout?.applied_balance_amount}></sc-format-number>
              </sc-line-item>
            )}

            {!!checkout.trial_amount && (
              <sc-line-item>
                <span slot="description">{__('Free Trial', 'surecart')}</span>
                <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={checkout?.trial_amount}></sc-format-number>
              </sc-line-item>
            )}

            {!!checkout?.discount_amount && (
              <sc-line-item>
                <span slot="description">{__('Discounts', 'surecart')}</span>
                <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={checkout?.discount_amount}></sc-format-number>
              </sc-line-item>
            )}

            {!!checkout.tax_amount && (
              <sc-line-item>
                <span slot="description">{formatTaxDisplay(checkout?.tax_label)}</span>
                <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={checkout?.tax_amount}></sc-format-number>
              </sc-line-item>
            )}

            <sc-divider style={{ '--spacing': '0' }}></sc-divider>

            <sc-line-item>
              <span slot="description">{__('Payment', 'surecart')}</span>
              <a
                href={addQueryArgs(window.location.href, {
                  action: 'update_payment_method',
                })}
                slot="price-description"
              >
                <sc-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
                  <sc-payment-method paymentMethod={checkout?.payment_method}></sc-payment-method>
                  <sc-icon name="edit-3"></sc-icon>
                </sc-flex>
              </a>
            </sc-line-item>

            <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
              <span slot="title">{__('Total Due', 'surecart')}</span>
              <sc-format-number slot="price" type="currency" currency={checkout?.currency} value={checkout?.amount_due}></sc-format-number>
              <span slot="currency">{checkout.currency}</span>
            </sc-line-item>
          </sc-card>
        </sc-toggle>
      </Host>
    );
  }
}
