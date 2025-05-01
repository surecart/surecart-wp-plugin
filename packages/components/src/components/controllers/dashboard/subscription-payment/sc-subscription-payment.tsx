import { Component, h, Prop, State, Fragment } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { PaymentMethod, Subscription, ManualPaymentMethod } from '../../../../types';
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
  @State() manualPaymentMethods: ManualPaymentMethod[];
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
        expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
        customer_ids: this.customerIds,
        reusable: true,
        ...(this.subscription?.live_mode !== null ? { live_mode: this.subscription.live_mode } : {}),
      }),
    })) as PaymentMethod[];

    this.manualPaymentMethods = (await apiFetch({
      path: addQueryArgs(`surecart/v1/manual_payment_methods`, {
        customer_ids: this.customerIds,
        reusable: true,
        live_mode: this.subscription?.live_mode,
      }),
    })) as ManualPaymentMethod[];

    // remove archived methods if the current payment method id is not the archived one.
    this.manualPaymentMethods = this.manualPaymentMethods.filter(method => {
      if( method?.archived  && method?.id !== this.currentPaymentMethodId()) {
         return false;
       }
       return true;
     });  
  }

  async handleSubmit(e) {
    const { payment_method } = await e.target.getFormJson();
    const isManualPaymentMethod = (this.manualPaymentMethods || []).some(method => method.id === payment_method);

    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `/surecart/v1/subscriptions/${this.subscription?.id}`,
        method: 'PATCH',
        data: {
          ...(!isManualPaymentMethod ? { payment_method, manual_payment: false } : { manual_payment_method: payment_method, manual_payment: true }),
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

  currentPaymentMethodId() {
    return this.subscription?.manual_payment
    ? this.subscription?.manual_payment_method
    : (this.subscription?.payment_method as PaymentMethod)?.id || this.subscription?.payment_method;
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    const modeMethods = this.paymentMethods.filter(method => method?.live_mode === this.subscription?.live_mode);
    const hasNoPaymentMethods = (!this.paymentMethods?.length && !this.manualPaymentMethods?.length) || (this.paymentMethods?.length && !modeMethods?.length);

    if (hasNoPaymentMethods) {
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
            {(this.paymentMethods || []).map(method => {
              if (method?.live_mode !== this?.subscription?.live_mode) return null;
              return (
                <sc-choice checked={this.currentPaymentMethodId() === method?.id} name="payment_method" value={method?.id}>
                  <sc-payment-method paymentMethod={method} full={true} />
                </sc-choice>
              );
            })}
            {(this.manualPaymentMethods || []).map(method => {
              return (
                <sc-choice checked={this.currentPaymentMethodId() === method?.id} name="payment_method" value={method?.id}>
                  <sc-manual-payment-method paymentMethod={method} showDescription />
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
