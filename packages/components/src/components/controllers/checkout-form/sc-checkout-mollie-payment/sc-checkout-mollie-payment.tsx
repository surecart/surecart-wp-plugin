import { Component, Event, EventEmitter, Fragment, h, Prop, State, Watch } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { openWormhole } from 'stencil-wormhole';
import selectedProcessor from '../../../../store/selected-processor';
import processors from '../../../../store/processors';

import apiFetch from '../../../../functions/fetch';
import { Pagination, PaymentMethodType, ResponseError, ShippingAddress } from '../../../../types';

@Component({
  tag: 'sc-checkout-mollie-payment',
  styleUrl: 'sc-checkout-mollie-payment.css',
  shadow: true,
})
export class ScCheckoutMolliePayment {
  @Prop() processorId: string;
  @Prop() sortOrder: string[] = ['creditcard', 'paypal'];
  @Prop() totalAmount: number;
  @Prop() method: string;
  @Prop() shippingAddress: ShippingAddress;
  @Prop() currencyCode: string = 'usd';
  @Prop() reusablePaymentMethodRequired: boolean;

  @State() error: ResponseError;
  @State() methods: PaymentMethodType[];

  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  @Watch('totalAmount')
  @Watch('currencyCode')
  @Watch('reusablePaymentMethodRequired')
  handleSingeItemsChange() {
    this.fetchMethods();
  }

  @Watch('shippingAddress')
  handleShippingAddressChange(val, prev) {
    if (val?.country !== prev?.country) {
      this.fetchMethods();
    }
  }

  componentWillLoad() {
    selectedProcessor.id = 'mollie';
    selectedProcessor.manual = false;
  }

  async fetchMethods() {
    try {
      processors.loadingMethods = true;
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/processors/${this.processorId}/payment_method_types`, {
          amount: this.totalAmount,
          country: this.shippingAddress?.country || 'us',
          currency: this.currencyCode,
          reusable: this.reusablePaymentMethodRequired,
          per_page: 100,
        }),
      })) as {
        object: 'list';
        pagination: Pagination;
        data: PaymentMethodType[];
      };
      processors.methods = response?.data || [];
    } catch (e) {
      this.scError.emit(e);
      console.error(e);
    } finally {
      processors.loadingMethods = false;
    }
  }

  render() {
    if (processors.loadingMethods && !processors?.methods?.length) {
      return <sc-skeleton></sc-skeleton>;
    }

    if (!processors?.methods?.length) {
      return <sc-warning>{__('No available payment methods', 'surecart')} </sc-warning>;
    }

    const Tag = processors.methods?.length > 1 ? 'sc-toggles' : 'div';

    return (
      <Fragment>
        <Tag collapsible={false} theme="container">
          {(processors.methods || [])
            .sort((a, b) => {
              if (this.sortOrder.indexOf(a.id) === -1) return 1;
              if (this.sortOrder.indexOf(b.id) === -1) return -1;
              return this.sortOrder.indexOf(a.id) - this.sortOrder.indexOf(b.id);
            })
            .map(method => (
              <sc-payment-method-choice processor-id="mollie" method-id={method?.id} key={method?.id} hasOthers={processors.methods?.length > 1}>
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
        </Tag>
        {!!processors.loadingMethods && <sc-block-ui spinner />}
      </Fragment>
    );
  }
}

openWormhole(ScCheckoutMolliePayment, ['totalAmount', 'shippingAddress', 'currencyCode', 'reusablePaymentRequest', 'method'], false);
