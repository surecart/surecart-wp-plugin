import { Component, Element, Fragment, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription, SubscriptionProtocol } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';
import { productNameWithPrice } from '../../../../functions/price';
@Component({
  tag: 'sc-subscription',
  styleUrl: 'sc-subscription.scss',
  shadow: true,
})
export class ScSubscription {
  @Element() el: HTMLScSubscriptionsListElement;

  /** The subscription ID */
  @Prop() subscriptionId: string;

  /** Whether to show the cancel button */
  @Prop() showCancel: boolean;

  /** Heading to display */
  @Prop() heading: string;

  /** Query to pass to the API */
  @Prop() query: object;

  /** The subscription protocol */
  @Prop() protocol: SubscriptionProtocol;

  /** The subscription */
  @Prop({ mutable: true }) subscription: Subscription;

  /** Update the payment method url */
  @Prop() updatePaymentMethodUrl: string;

  /** Loading state */
  @State() loading: boolean;

  /** Cancel modal */
  @State() cancelModal: boolean;

  /** Resubscribe modal */
  @State() resubscribeModal: boolean;

  /**  Busy state */
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      if (!this.subscription) {
        this.getSubscription();
      }
    });
  }

  async cancelPendingUpdate() {
    const r = confirm(__('Are you sure you want to cancel the pending update to your plan?', 'surecart'));
    if (!r) return;
    try {
      this.busy = true;
      this.subscription = (await apiFetch({
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscription?.id}/`, {
          expand: ['price', 'price.product', 'current_period', 'period.checkout', 'purchase', 'purchase.license', 'license.activations', 'discount', 'discount.coupon'],
        }),
        method: 'PATCH',
        data: {
          purge_pending_update: true,
        },
      })) as Subscription;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
      console.error(this.error);
    } finally {
      this.busy = false;
    }
  }

  async renewSubscription() {
    try {
      this.error = '';
      this.busy = true;
      this.subscription = (await apiFetch({
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscription?.id}/renew`, {
          expand: ['price', 'price.product', 'current_period', 'period.checkout', 'purchase', 'purchase.license', 'license.activations', 'discount', 'discount.coupon'],
        }),
        method: 'PATCH',
      })) as Subscription;
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getSubscription() {
    try {
      this.loading = true;
      this.subscription = (await await apiFetch({
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscriptionId || this.subscription?.id}`, {
          expand: ['price', 'price.product', 'current_period'],
          ...(this.query || {}),
        }),
      })) as Subscription;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  renderName(subscription: Subscription) {
    if (typeof subscription?.price?.product !== 'string') {
      return productNameWithPrice(subscription?.price);
    }
    return __('Subscription', 'surecart');
  }

  renderRenewalText(subscription) {
    const tag = <sc-subscription-status-badge subscription={subscription}></sc-subscription-status-badge>;

    if (subscription?.cancel_at_period_end && subscription.current_period_end_at) {
      return (
        <span>
          {tag}{' '}
          {
            /* translators: %s: current period end date */
            sprintf(__('Your plan will be canceled on %s', 'surecart'), subscription.current_period_end_at_date)
          }
        </span>
      );
    }
    if (subscription.status === 'trialing' && subscription.trial_end_at) {
      return (
        <span>
          {tag}{' '}
          {
            /* translators: %s: trial end date */
            sprintf(__('Your plan begins on %s', 'surecart'), subscription.trial_end_at_date)
          }
        </span>
      );
    }
    if (subscription.status === 'active' && subscription.current_period_end_at) {
      return (
        <span>
          {tag}{' '}
          {
            /* translators: %s: current period end date */
            sprintf(__('Your plan renews on %s', 'surecart'), subscription.current_period_end_at_date)
          }
        </span>
      );
    }

    return tag;
  }

  renderEmpty() {
    return <slot name="empty">{__('This subscription does not exist.', 'surecart')}</slot>;
  }

  renderLoading() {
    return (
      <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
        </div>
      </sc-stacked-list-row>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.subscription) {
      return this.renderEmpty();
    }

    return (
      <Fragment>
        <sc-subscription-next-payment subscription={this.subscription} updatePaymentMethodUrl={this.updatePaymentMethodUrl}>
          <sc-subscription-details subscription={this.subscription}></sc-subscription-details>
        </sc-subscription-next-payment>
      </Fragment>
    );
  }

  render() {
    const paymentMethodExists = this?.subscription.payment_method || this?.subscription.manual_payment;

    return (
      <sc-dashboard-module heading={this.heading || __('Current Plan', 'surecart')} class="subscription" error={this.error}>
        {!!this.subscription && (
          <sc-flex slot="end" class="subscription__action-buttons">
            {this.updatePaymentMethodUrl && paymentMethodExists && (
              <sc-button type="link" href={this.updatePaymentMethodUrl}>
                <sc-icon name="credit-card" slot="prefix"></sc-icon>
                {__('Update Payment Method', 'surecart')}
              </sc-button>
            )}
            {!paymentMethodExists && (
              <sc-button
                type="link"
                href={addQueryArgs(window.location.href, {
                  action: 'create',
                  model: 'payment_method',
                  id: this?.subscription.id,
                  ...(this?.subscription?.live_mode === false ? { live_mode: false } : {}),
                })}
              >
                <sc-icon name="credit-card" slot="prefix"></sc-icon>
                {__('Add Payment Method', 'surecart')}
              </sc-button>
            )}
            {!!Object.keys(this.subscription?.pending_update).length && (
              <sc-button type="link" onClick={() => this.cancelPendingUpdate()}>
                <sc-icon name="x-octagon" slot="prefix"></sc-icon>
                {__('Cancel Scheduled Update', 'surecart')}
              </sc-button>
            )}
            {this?.subscription?.cancel_at_period_end ? (
              <sc-button type="link" onClick={() => this.renewSubscription()}>
                <sc-icon name="repeat" slot="prefix"></sc-icon>
                {__('Restore Plan', 'surecart')}
              </sc-button>
            ) : (
              this.subscription?.status !== 'canceled' &&
              this.subscription?.current_period_end_at &&
              this.showCancel && (
                <sc-button type="link" onClick={() => (this.cancelModal = true)}>
                  <sc-icon name="x" slot="prefix"></sc-icon>
                  {__('Cancel Plan', 'surecart')}
                </sc-button>
              )
            )}
            {this.subscription?.status === 'canceled' && (
              <sc-button
                type="link"
                {...(!!this.subscription?.payment_method || this?.subscription.manual_payment
                  ? {
                      onClick: () => (this.resubscribeModal = true),
                    }
                  : {
                      href: this?.updatePaymentMethodUrl,
                    })}
              >
                <sc-icon name="repeat" slot="prefix"></sc-icon>
                {__('Resubscribe', 'surecart')}
              </sc-button>
            )}
          </sc-flex>
        )}

        <sc-card style={{ '--overflow': 'hidden' }} noPadding>
          {this.renderContent()}
        </sc-card>

        {this.busy && <sc-block-ui spinner></sc-block-ui>}

        <sc-cancel-dialog
          subscription={this.subscription}
          protocol={this.protocol}
          open={this.cancelModal}
          onScRequestClose={() => (this.cancelModal = false)}
          onScRefresh={() => this.getSubscription()}
        />
        <sc-subscription-reactivate
          subscription={this.subscription}
          open={this.resubscribeModal}
          onScRequestClose={() => (this.resubscribeModal = false)}
          onScRefresh={() => this.getSubscription()}
        />
      </sc-dashboard-module>
    );
  }
}
