import { Component, Event, EventEmitter, Fragment, h, Prop, State } from '@stencil/core';
import { Address, Pagination, PaymentMethodType, ResponseError } from '../../../../types';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { state as selectedProcessor } from '@store/selected-processor';
import { state as processorsState } from '@store/processors';
import { hasMultipleMethodChoices, availableMethodTypes, availableManualPaymentMethods } from '@store/processors/getters';
// checkout store.
import { state as checkoutState } from '@store/checkout';
import { listenTo } from '@store/checkout/functions';
import { checkoutIsLocked } from '@store/checkout/getters';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';

import apiFetch from '../../../../functions/fetch';

import { ManualPaymentMethods } from '../payment/ManualPaymentMethods';

@Component({
  tag: 'sc-checkout-mollie-payment',
  styleUrl: 'sc-checkout-mollie-payment.css',
  shadow: true,
})
export class ScCheckoutMolliePayment {
  @Prop() processorId: string;
  @Prop() method: string;

  @State() error: ResponseError;
  @State() methods: PaymentMethodType[];

  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  componentWillLoad() {
    selectedProcessor.id = 'mollie';
    this.fetchMethods();
    listenTo('checkout', ['total_amount', 'currency', 'reusabled_payment_method_required', 'shipping_address'], () => this.fetchMethods());
  }

  async fetchMethods() {
    const checkout = checkoutState.checkout;
    if (!checkout.currency) return; // wait until we have a currency.
    try {
      lockCheckout('methods');
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/processors/${this.processorId}/payment_method_types`, {
          amount: checkout?.total_amount,
          country: (checkout?.shipping_address as Address)?.country || 'us',
          currency: checkout?.currency,
          ...(checkout?.reusable_payment_method_required ? { reusable: checkout?.reusable_payment_method_required } : {}),
          per_page: 100,
        }),
      })) as {
        object: 'list';
        pagination: Pagination;
        data: PaymentMethodType[];
      };
      processorsState.methods = response?.data || [];
    } catch (e) {
      this.scError.emit(e);
      console.error(e);
    } finally {
      unLockCheckout('methods');
    }
  }

  renderLoading() {
    return (
      <sc-card>
        <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '30%', marginBottom: '0.5em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '60%', marginBottom: '0.5em' }}></sc-skeleton>
      </sc-card>
    );
  }

  render() {
    if (checkoutIsLocked('methods') && !availableMethodTypes()?.length) {
      return this.renderLoading();
    }

    if (!checkoutState.checkout?.currency) {
      return this.renderLoading();
    }

    if (!availableMethodTypes()?.length) {
      return (
        <sc-alert type="warning" open>
          {__('No available payment methods', 'surecart')}{' '}
        </sc-alert>
      );
    }

    const Tag = hasMultipleMethodChoices() ? 'sc-toggles' : 'div';

    return (
      <Fragment>
        <Tag collapsible={false} theme="container">
          {(availableMethodTypes() || []).map(method => (
            <sc-payment-method-choice processor-id="mollie" method-id={method?.id} key={method?.id}>
              <span slot="summary" class="sc-payment-toggle-summary">
                {!!method?.image && <img src={method?.image} />}
                <span>{method?.description}</span>
              </span>

              <sc-card>
                <sc-payment-selected label={sprintf(__('%s selected for check out.', 'surecart'), method?.description)}>
                  {!!method?.image && <img slot="icon" src={method?.image} style={{ width: '32px' }} />}
                  {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
                </sc-payment-selected>
              </sc-card>
            </sc-payment-method-choice>
          ))}
          <ManualPaymentMethods methods={availableManualPaymentMethods()} />
        </Tag>
        {!!checkoutIsLocked('methods') && <sc-block-ui class="busy-block-ui" z-index={9} style={{ '--sc-block-ui-opacity': '0.4' }}></sc-block-ui>}
      </Fragment>
    );
  }
}
