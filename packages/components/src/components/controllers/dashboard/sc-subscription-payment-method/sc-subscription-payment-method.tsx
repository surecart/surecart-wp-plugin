import { Component, Prop, State, h, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { PaymentMethod, Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-payment-method',
  styleUrl: 'sc-subscription-payment-method.css',
  shadow: true,
})
export class ScSubscriptionPaymentMethod {
  /** The element */
  @Element() el: HTMLScSubscriptionPaymentElement;

  /** The heading */
  @Prop() heading: string;

  /** The subscription */
  @Prop() subscription: Subscription;

  /** The list of payment methods. */
  @State() paymentMethods: PaymentMethod[];

  /** The error. */
  @State() error: string;

  /** Loading state. */
  @State() loading: boolean;
  @State() busy: boolean;
  @State() method: string;

  renderLoading() {
    return (
      <sc-card noPadding>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '4' }} mobile-size={500}>
            {[...Array(4)].map(() => (
              <sc-skeleton style={{ width: '100px', display: 'inline-block' }}></sc-skeleton>
            ))}
          </sc-stacked-list-row>
        </sc-stacked-list>
      </sc-card>
    );
  }

  renderEmpty() {
    return (
      <slot name="empty">
        <sc-card>
          <sc-empty icon="credit-card">{__('You do not have any payment methods.', 'surecart')}</sc-empty>
        </sc-card>
      </slot>
    );
  }

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getPaymentMethods();
    });
  }

  /** Get all subscriptions */
  async getPaymentMethods() {
    if (this.paymentMethods?.length) return;
    try {
      this.loading = true;
      this.paymentMethods = await this.fetchMethods();
    } catch (e) {
      this.error = e?.messsage || __('Something went wrong', 'surecart');
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  async fetchMethods() {
    return (await apiFetch({
      path: addQueryArgs(`surecart/v1/payment_methods`, {
        expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
        customer_ids: [this.subscription?.customer?.id || this.subscription?.customer],
        reusable: true,
        live_mode: this.subscription?.live_mode,
      }),
    })) as PaymentMethod[];
  }

  async deleteMethod(method: PaymentMethod) {
    const r = confirm(__('Are you sure you want to remove this payment method?', 'surecart'));
    if (!r) return;
    try {
      this.busy = true;
      (await apiFetch({
        path: `surecart/v1/payment_methods/${method?.id}/detach`,
        method: 'PATCH',
      })) as PaymentMethod;
      // remove from view.
      this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
    } catch (e) {
      this.error = e?.messsage || __('Something went wrong', 'surecart');
      console.error(this.error);
    } finally {
      this.busy = false;
    }
  }

  async updateMethod(e) {
    const { payment_method } = await e.target.getFormJson();
    if (payment_method === ((this.subscription?.payment_method as PaymentMethod)?.id || this.subscription?.payment_method)) {
      return;
    }
    try {
      this.busy = true;
      this.subscription = (await apiFetch({
        path: `surecart/v1/subscriptions/${this.subscription?.id}`,
        method: 'PATCH',
        data: {
          payment_method,
        },
      })) as Subscription;
      // remove from view.
    } catch (e) {
      this.error = e?.messsage || __('Something went wrong', 'surecart');
      console.error(this.error);
    } finally {
      this.busy = false;
    }
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.paymentMethods?.length) {
      return this.renderEmpty();
    }

    return (
      <sc-form onScSubmit={e => this.updateMethod(e)}>
        <sc-choices>{this.renderList()}</sc-choices>
        <sc-button type="primary" submit full size="large" busy={this.busy} disabled={this.busy}>
          {__('Update Payment Method', 'surecart')}
        </sc-button>
      </sc-form>
    );
  }

  renderList() {
    return this.paymentMethods.map(paymentMethod => {
      const subscription_payment_method_id = (this.subscription?.payment_method as PaymentMethod)?.id || this.subscription?.payment_method;
      const { id, card, live_mode, paypal_account } = paymentMethod;

      return (
        <sc-choice checked={subscription_payment_method_id === id} name="payment_method" value={id} required>
          <sc-flex justifyContent="flex-start">
            <sc-payment-method paymentMethod={paymentMethod} />{' '}
            {!live_mode && (
              <sc-tag type="warning" size="small">
                {__('Test', 'surecart')}
              </sc-tag>
            )}
          </sc-flex>
          <div slot="description">
            {!!card?.exp_month && (
              <span>
                {__('Exp.', 'surecart')}
                {card?.exp_month}/{card?.exp_year}
              </span>
            )}
            {!!paypal_account && paypal_account?.email}
          </div>
          {subscription_payment_method_id === id && (
            <sc-tag type="info" slot="price">
              {__('Current Payment Method', 'surecart')}
            </sc-tag>
          )}
        </sc-choice>
      );
    });
  }

  render() {
    return (
      <sc-dashboard-module heading={this.heading || __('Update Payment Method', 'surecart')} class="subscription" error={this.error}>
        <sc-flex slot="end">
          <sc-button
            type="link"
            href={addQueryArgs(window.location.href, {
              action: 'create',
              model: 'payment_method',
              ...(this.subscription?.live_mode === false ? { live_mode: false } : {}),
              success_url: window.location.href,
            })}
          >
            <sc-icon name="plus" slot="prefix"></sc-icon>
            {__('Add New', 'surecart')}
          </sc-button>
        </sc-flex>

        {this.renderContent()}

        {this.busy && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
