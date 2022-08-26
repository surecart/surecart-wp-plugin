import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Customer, PaymentMethod } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-payment-methods-list',
  styleUrl: 'sc-payment-methods-list.scss',
  shadow: true,
})
export class ScPaymentMethodsList {
  @Element() el: HTMLScPaymentMethodsListElement;
  /** Query to fetch paymentMethods */
  @Prop() query: object;
  @Prop() heading: string;

  @State() paymentMethods: Array<PaymentMethod> = [];

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getPaymentMethods();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
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
      alert(e?.messsage || __('Something went wrong', 'surecart'));
    } finally {
      this.busy = false;
    }
  }

  async setDefault(method: PaymentMethod) {
    try {
      this.busy = true;
      (await apiFetch({
        path: `surecart/v1/customers/${(method?.customer as Customer)?.id}`,
        method: 'PATCH',
        data: {
          default_payment_method: method.id,
        },
      })) as PaymentMethod;
      this.paymentMethods = (await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      alert(e?.messsage || __('Something went wrong', 'surecart'));
    } finally {
      this.busy = false;
    }
  }

  /** Get all paymentMethods */
  async getPaymentMethods() {
    try {
      this.loading = true;
      this.paymentMethods = (await await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
          ...this.query,
        }),
      })) as PaymentMethod[];
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
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="credit-card">{__("You don't have any saved payment methods.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderList() {
    return this.paymentMethods.map(paymentMethod => {
      const { id, card, customer, live_mode, billing_agreement, paypal_account } = paymentMethod;
      console.log(paymentMethod);
      return (
        <sc-stacked-list-row style={{ '--columns': billing_agreement ? '2' : '3' }}>
          <sc-payment-method paymentMethod={paymentMethod} />

          <div>
            {!!card?.exp_month && (
              <span>
                {__('Exp.', 'surecart')}
                {card?.exp_month}/{card?.exp_year}
              </span>
            )}
            {!!paypal_account && paypal_account?.email}
          </div>

          <sc-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em', 'marginLeft': 'auto' }}>
            {typeof customer !== 'string' && customer?.default_payment_method === id && <sc-tag type="info">{__('Default', 'surecart')}</sc-tag>}
            {!live_mode && <sc-tag type="warning">{__('Test', 'surecart')}</sc-tag>}
          </sc-flex>

          <sc-dropdown placement="bottom-end" slot="suffix">
            <sc-icon name="more-horizontal" slot="trigger"></sc-icon>
            <sc-menu>
              {typeof customer !== 'string' && customer?.default_payment_method !== id && (
                <sc-menu-item onClick={() => this.setDefault(paymentMethod)}>{__('Make Default', 'surecart')}</sc-menu-item>
              )}
              <sc-menu-item onClick={() => this.deleteMethod(paymentMethod)}>{__('Delete', 'surecart')}</sc-menu-item>
            </sc-menu>
          </sc-dropdown>
        </sc-stacked-list-row>
      );
    });
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.paymentMethods?.length === 0) {
      return this.renderEmpty();
    }

    return (
      <sc-card no-padding>
        <sc-stacked-list>{this.renderList()}</sc-stacked-list>
      </sc-card>
    );
  }

  render() {
    return (
      <sc-dashboard-module class="payment-methods-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Payment Methods', 'surecart')}</slot>
        </span>

        <sc-flex slot="end">
          <sc-button
            type="link"
            href={addQueryArgs(window.location.href, {
              action: 'index',
              model: 'charge',
            })}
          >
            <sc-icon name="clock" slot="prefix"></sc-icon>
            {__('Payment History', 'surecart')}
          </sc-button>
          <sc-button
            type="link"
            href={addQueryArgs(window.location.href, {
              action: 'create',
              model: 'payment_method',
            })}
          >
            <sc-icon name="plus" slot="prefix"></sc-icon>
            {__('Add', 'surecart')}
          </sc-button>
        </sc-flex>

        {this.renderContent()}

        {this.busy && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
