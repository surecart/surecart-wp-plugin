import { Component, h, Prop, State, Fragment } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { PaymentMethod, Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-payment',
  styleUrl: 'sc-subscription-payment.scss',
  shadow: true,
})
export class ScSubscriptionPayment {
  @Prop() subscriptionId: string;
  @Prop() backUrl: string;
  @Prop() successUrl: string;
  @Prop({ mutable: true }) subscription: Subscription;
  @Prop() paymentMethods: Array<PaymentMethod> = [];
  @Prop() customerIds: Array<string> = [];
  @State() loading: boolean;
  @State() busy: boolean;
  @State() error: string;

  componentWillLoad() {
    this.fetchItems();
  }

  async fetchItems() {
    try {
      this.loading = true;
      await Promise.all([this.fetchSubscription(), this.fetchPaymentMethods()]);
    } catch (e) {
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchSubscription() {
    if (!this.subscriptionId) return;
    this.subscription = (await apiFetch({
      path: addQueryArgs(`/surecart/v1/subscriptions/${this.subscriptionId}`, {
        expand: ['price', 'price.product', 'current_period', 'product'],
      }),
    })) as Subscription;
  }

  async fetchPaymentMethods() {
    this.paymentMethods = (await apiFetch({
      path: addQueryArgs(`/surecart/v1/payment_methods`, {
        expand: ['card'],
        customer_ids: this.customerIds,
        ...(this.subscription?.live_mode !== null ? { live_mode: this.subscription.live_mode } : {}),
      }),
    })) as PaymentMethod[];
  }

  async handleSubmit(e) {
    const { method } = await e.target.getFormJson();

    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `/surecart/v1/subscriptions/${this.subscription?.id}`,
        method: 'PATCH',
        data: {
          payment_method: method,
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

  renderLoading() {
    return (
      <Fragment>
        <sc-choice name="loading" disabled>
          <sc-skeleton style={{ width: '60px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></sc-skeleton>
          <sc-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></sc-skeleton>
        </sc-choice>
        <sc-button type="primary" full submit loading busy></sc-button>
        {!!this.backUrl && <sc-button href={this.backUrl} full loading busy></sc-button>}
      </Fragment>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    const modeMethods = this.paymentMethods.filter(method => method?.live_mode === this.subscription?.live_mode);

    if (!modeMethods?.length) {
      return (
        <Fragment>
          <sc-empty icon="credit-card">{__('You have no saved payment methods.', 'surecart')}</sc-empty>
          {!!this.backUrl && (
            <sc-button href={this.backUrl} full>
              {__('Go Back', 'surecart')}
            </sc-button>
          )}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <sc-choices>
          <div>
            {(this.paymentMethods || []).map(({ id, card, live_mode }) => {
              if (live_mode !== this?.subscription?.live_mode) return null;
              return (
                <sc-choice checked={this.subscription?.payment_method === id} name="method" value={id}>
                  <sc-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
                    <sc-cc-logo style={{ fontSize: '36px' }} brand={card?.brand}></sc-cc-logo>
                    <span style={{ fontSize: '7px', whiteSpace: 'nowrap' }}>
                      {'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
                    </span>
                    <span>{card?.last4}</span>
                  </sc-flex>
                  <span slot="per">
                    {__('Expires', 'surecart')} {card?.exp_month}/{card?.exp_year}
                  </span>
                </sc-choice>
              );
            })}
          </div>
        </sc-choices>

        <sc-button type="primary" full submit loading={this.loading || this.busy} disabled={this.loading || this.busy}>
          {__('Update', 'surecart')}
        </sc-button>

        {!!this.backUrl && (
          <sc-button href={this.backUrl} full loading={this.loading || this.busy} disabled={this.loading || this.busy}>
            {__('Go Back', 'surecart')}
          </sc-button>
        )}
      </Fragment>
    );
  }

  render() {
    return (
      <sc-dashboard-module heading={__('Select a payment method', 'surecart')} class="subscription-payment" error={this.error}>
        <sc-form onScFormSubmit={e => this.handleSubmit(e)}>
          <sc-card>{this.renderContent()}</sc-card>
        </sc-form>
        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
