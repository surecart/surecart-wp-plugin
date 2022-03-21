import { Component, h, Prop, State, Fragment } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { PaymentMethod, Subscription } from '../../../../types';

@Component({
  tag: 'ce-subscription-payment',
  styleUrl: 'ce-subscription-payment.scss',
  shadow: true,
})
export class CeSubscriptionPayment {
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
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.loading = false;
    }
  }

  async fetchSubscription() {
    if (!this.subscriptionId) return;
    this.subscription = (await apiFetch({
      path: addQueryArgs(`/checkout-engine/v1/subscriptions/${this.subscriptionId}`, {
        expand: ['price', 'price.product', 'latest_invoice', 'product'],
      }),
    })) as Subscription;
  }

  async fetchPaymentMethods() {
    this.paymentMethods = (await apiFetch({
      path: addQueryArgs(`/checkout-engine/v1/payment_methods`, {
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
        path: `/checkout-engine/v1/subscriptions/${this.subscription?.id}`,
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
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
      this.busy = false;
    }
  }

  renderLoading() {
    return (
      <Fragment>
        <ce-choice name="loading" disabled>
          <ce-skeleton style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton style={{ width: '80px', display: 'inline-block' }} slot="price"></ce-skeleton>
          <ce-skeleton style={{ width: '120px', display: 'inline-block' }} slot="description"></ce-skeleton>
        </ce-choice>
        <ce-button type="primary" full submit loading busy></ce-button>
        {!!this.backUrl && <ce-button href={this.backUrl} full loading busy></ce-button>}
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
          <ce-empty icon="credit-card">{__('You have no saved payment methods.', 'checkout_engine')}</ce-empty>
          {!!this.backUrl && (
            <ce-button href={this.backUrl} full>
              {__('Go Back', 'checkout_engine')}
            </ce-button>
          )}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <ce-choices>
          <div>
            {(this.paymentMethods || []).map(({ id, card, live_mode }) => {
              if (live_mode !== this?.subscription?.live_mode) return null;
              return (
                <ce-choice checked={this.subscription?.payment_method === id} name="method" value={id}>
                  <ce-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
                    <ce-cc-logo style={{ fontSize: '36px' }} brand={card?.brand}></ce-cc-logo>
                    <span style={{ fontSize: '7px', whiteSpace: 'nowrap' }}>
                      {'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
                    </span>
                    <span>{card?.last4}</span>
                  </ce-flex>
                  <span slot="per">
                    {__('Expires', 'checkout_engine')} {card?.exp_month}/{card?.exp_year}
                  </span>
                </ce-choice>
              );
            })}
          </div>
        </ce-choices>

        <ce-button type="primary" full submit loading={this.loading || this.busy} disabled={this.loading || this.busy}>
          {__('Update', 'checkout_engine')}
        </ce-button>

        {!!this.backUrl && (
          <ce-button href={this.backUrl} full loading={this.loading || this.busy} disabled={this.loading || this.busy}>
            {__('Go Back', 'checkout_engine')}
          </ce-button>
        )}
      </Fragment>
    );
  }

  render() {
    return (
      <ce-dashboard-module heading={__('Select a payment method', 'checkout_engine')} class="subscription-payment" error={this.error}>
        <ce-form onCeFormSubmit={e => this.handleSubmit(e)}>
          <ce-card>{this.renderContent()}</ce-card>
        </ce-form>
        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
