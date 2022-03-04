import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Customer, PaymentMethod } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-payment-methods-list',
  styleUrl: 'ce-payment-methods-list.scss',
  shadow: true,
})
export class CePaymentMethodsList {
  @Element() el: HTMLCePaymentMethodsListElement;
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
    const r = confirm(__('Are you sure you want to remove this payment method?', 'checkout_engine'));
    if (!r) return;
    try {
      this.busy = true;
      (await apiFetch({
        path: `checkout-engine/v1/payment_methods/${method?.id}/detach`,
        method: 'PATCH',
      })) as PaymentMethod;
      // remove from view.
      this.paymentMethods = this.paymentMethods.filter(m => m.id !== method.id);
    } catch (e) {
      alert(e?.messsage || __('Something went wrong', 'checkout_engine'));
    } finally {
      this.busy = false;
    }
  }

  async setDefault(method: PaymentMethod) {
    try {
      this.busy = true;
      (await apiFetch({
        path: `checkout-engine/v1/customers/${(method?.customer as Customer)?.id}`,
        method: 'PATCH',
        data: {
          default_payment_method: method.id,
        },
      })) as PaymentMethod;
      this.paymentMethods = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/payment_methods/`, {
          expand: ['card', 'customer'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      alert(e?.messsage || __('Something went wrong', 'checkout_engine'));
    } finally {
      this.busy = false;
    }
  }

  /** Get all paymentMethods */
  async getPaymentMethods() {
    try {
      this.loading = true;
      this.paymentMethods = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/payment_methods/`, {
          expand: ['card', 'customer'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  renderEmpty() {
    return <slot name="empty">{__('You have no saved payment methods.', 'checkout_engine')}</slot>;
  }

  renderLoading() {
    return (
      <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
        </div>
      </ce-stacked-list-row>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (this.paymentMethods?.length === 0) {
      return this.renderEmpty();
    }

    return this.paymentMethods.map(paymentMethod => {
      const { id, card, customer, live_mode } = paymentMethod;
      return (
        <ce-stacked-list-row style={{ '--columns': '4' }} mobile-size={0}>
          <ce-flex justify-content="flex-start" align-items="center" style={{ '--spacing': '0.5em' }}>
            <ce-cc-logo style={{ fontSize: '36px' }} brand={card?.brand}></ce-cc-logo>
            <span style={{ fontSize: '7px', whiteSpace: 'nowrap' }}>
              {'\u2B24'} {'\u2B24'} {'\u2B24'} {'\u2B24'}
            </span>
            <span>{card?.last4}</span>
          </ce-flex>

          <div>
            {__('Exp.', 'checkout_engine')} {card?.exp_month}/{card?.exp_year}
          </div>

          <div>
            {typeof customer !== 'string' && customer?.default_payment_method === id && <ce-tag type="info">{__('Default', 'checkout_engine')}</ce-tag>}
            {!live_mode && <ce-tag type="warning">{__('Test', 'checkout_engine')}</ce-tag>}
          </div>

          <div>
            <ce-dropdown position="bottom-right">
              <ce-icon name="more-horizontal" slot="trigger"></ce-icon>
              <ce-menu>
                {typeof customer !== 'string' && customer?.default_payment_method !== id && (
                  <ce-menu-item onClick={() => this.setDefault(paymentMethod)}>{__('Make Default', 'checkout_engine')}</ce-menu-item>
                )}
                <ce-menu-item onClick={() => this.deleteMethod(paymentMethod)}>{__('Delete', 'checkout_engine')}</ce-menu-item>
              </ce-menu>
            </ce-dropdown>
          </div>
        </ce-stacked-list-row>
      );
    });
  }

  render() {
    return (
      <ce-dashboard-module heading={this.heading || __('Payment Methods', 'checkout_engine')} class="payment-methods-list" error={this.error}>
        <ce-flex slot="end">
          <ce-button
            type="link"
            href={addQueryArgs(window.location.href, {
              action: 'index',
              model: 'charge',
            })}
          >
            <ce-icon name="clock" slot="prefix"></ce-icon>
            {__('Payment History', 'checkout_engine')}
          </ce-button>
          <ce-button
            type="link"
            href={addQueryArgs(window.location.href, {
              action: 'create',
              model: 'payment_method',
            })}
          >
            <ce-icon name="plus" slot="prefix"></ce-icon>
            {__('Add', 'checkout_engine')}
          </ce-button>
        </ce-flex>

        <ce-card no-padding>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>

        {this.busy && <ce-block-ui spinner></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
