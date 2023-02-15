import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
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

  /** The heading */
  @Prop() heading: string;

  /** Is this a customer */
  @Prop() isCustomer: boolean;

  /** Loaded payment methods */
  @State() paymentMethods: Array<PaymentMethod> = [];

  /** Loading state */
  @State() loading: boolean;
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  /** Stores the currently selected payment method for editing */
  @State() editPaymentMethod: PaymentMethod | false = false;

  /** Stores the currently selected payment method for editing */
  @State() deletePaymentMethod: PaymentMethod | false = false;

  /** Whether to cascade default payment method */
  @State() cascadeDefaultPaymentMethod: boolean = false;

  /** Only fetch if visible */
  componentWillLoad() {
    onFirstVisible(this.el, () => this.getPaymentMethods());
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /**
   * Delete the payment method.
   */
  async deleteMethod() {
    if (!this.deletePaymentMethod) return;
    try {
      this.busy = true;
      (await apiFetch({
        path: `surecart/v1/payment_methods/${this.deletePaymentMethod?.id}/detach`,
        method: 'PATCH',
      })) as PaymentMethod;
      // remove from view.
      this.paymentMethods = this.paymentMethods.filter(m => m.id !== (this.deletePaymentMethod as PaymentMethod)?.id);
    } catch (e) {
      alert(e?.messsage || __('Something went wrong', 'surecart'));
    } finally {
      this.busy = false;
    }
  }

  /**
   * Set the default payment method.
   */
  async setDefault() {
    if (!this.editPaymentMethod) return;
    try {
      this.error = '';
      this.busy = true;
      (await apiFetch({
        path: `surecart/v1/customers/${(this.editPaymentMethod?.customer as Customer)?.id}`,
        method: 'PATCH',
        data: {
          default_payment_method: this.editPaymentMethod?.id,
          cascade_default_payment_method: this.cascadeDefaultPaymentMethod,
        },
      })) as PaymentMethod;
      this.editPaymentMethod = false;
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }

    try {
      this.busy = true;
      this.paymentMethods = (await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.busy = false;
    }
  }

  /** Get all paymentMethods */
  async getPaymentMethods() {
    if (!this.isCustomer) {
      return;
    }

    try {
      this.loading = true;
      this.paymentMethods = (await apiFetch({
        path: addQueryArgs(`surecart/v1/payment_methods/`, {
          expand: ['card', 'customer', 'billing_agreement', 'paypal_account', 'payment_instrument', 'bank_account'],
          ...this.query,
        }),
      })) as PaymentMethod[];
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
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
                <sc-menu-item onClick={() => (this.editPaymentMethod = paymentMethod)}>{__('Make Default', 'surecart')}</sc-menu-item>
              )}
              <sc-menu-item onClick={() => (this.deletePaymentMethod = paymentMethod)}>{__('Delete', 'surecart')}</sc-menu-item>
            </sc-menu>
          </sc-dropdown>
        </sc-stacked-list-row>
      );
    });
  }

  renderContent() {
    if (!this.isCustomer) {
      return this.renderEmpty();
    }

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

  @Watch('editPaymentMethod')
  handleEditPaymentMethodChange() {
    // reset when payment method edit changes
    this.cascadeDefaultPaymentMethod = false;
  }

  render() {
    return (
      <sc-dashboard-module class="payment-methods-list" error={this.error}>
        <span slot="heading">
          <slot name="heading">{this.heading || __('Payment Methods', 'surecart')}</slot>
        </span>

        {this.isCustomer && (
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
        )}

        {this.renderContent()}

        <sc-dialog open={!!this.editPaymentMethod} label={__('Update Default Payment Method', 'surecart')} onScRequestClose={() => (this.editPaymentMethod = false)}>
          <sc-alert type="danger" open={!!this.error}>
            {this.error}
          </sc-alert>
          <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-small)' }}>
            <sc-alert type="info" open>
              {__('A default payment method will be used as a fallback in case other payment methods get removed from a subscription', 'surecart')}
            </sc-alert>
            <sc-switch checked={this.cascadeDefaultPaymentMethod} onScChange={e => (this.cascadeDefaultPaymentMethod = e.target.checked)}>
              {__('Update All Subscriptions', 'surecart')}
              <span slot="description">{__('Update all existing subscriptions to use this payment method', 'surecart')}</span>
            </sc-switch>
          </sc-flex>
          <div slot="footer">
            <sc-button type="text" onClick={() => (this.editPaymentMethod = false)}>
              {__('Cancel', 'surecart')}
            </sc-button>
            <sc-button type="primary" onClick={() => this.setDefault()}>
              {__('Make Default', 'surecart')}
            </sc-button>
          </div>
          {this.busy && <sc-block-ui spinner></sc-block-ui>}
        </sc-dialog>

        <sc-dialog open={!!this.deletePaymentMethod} label={__('Delete Payment Method', 'surecart')} onScRequestClose={() => (this.deletePaymentMethod = false)}>
          <sc-alert type="danger" open={!!this.error}>
            {this.error}
          </sc-alert>
          <sc-text>{__('Are you sure you want to remove this payment method?', 'surecart')}</sc-text>
          <div slot="footer">
            <sc-button type="text" onClick={() => (this.deletePaymentMethod = false)}>
              {__('Cancel', 'surecart')}
            </sc-button>
            <sc-button type="primary" onClick={() => this.deleteMethod()}>
              {__('Delete', 'surecart')}
            </sc-button>
          </div>
          {this.busy && <sc-block-ui spinner></sc-block-ui>}
        </sc-dialog>

        {this.busy && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
