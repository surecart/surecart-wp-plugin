import { Component, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Pagination, PaymentIntent, PaymentMethodType } from 'src/types';
import apiFetch from '../../../functions/fetch';

@Component({
  tag: 'sc-mollie-add-method',
  styleUrl: 'sc-mollie-add-method.css',
  shadow: true,
})
export class ScMollieAddMethod {
  @Prop() country: string;
  @Prop() processorId: string;
  @Prop() currency: string;
  @Prop() liveMode: boolean;
  @Prop() customerId: string;

  @State() methods: PaymentMethodType[] = [];
  @State() loading: boolean;
  @State() error: string;
  @State() selectedMethodId: string;
  @State() paymentIntent: PaymentIntent;

  componentWillLoad() {
    this.createPaymentIntent();
    this.fetchMethods();
  }

  async createPaymentIntent() {
    try {
      this.loading = true;
      this.error = '';
      this.paymentIntent = await apiFetch({
        method: 'POST',
        path: 'surecart/v1/payment_intents',
        data: {
          processor_type: 'mollie',
          live_mode: this.liveMode,
          customer_id: this.customerId,
          currency: this.currency,
        },
      });
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchMethods() {
    try {
      this.loading = true;
      const response = (await apiFetch({
        path: addQueryArgs(`surecart/v1/processors/${this.processorId}/payment_method_types`, {
          amount: 2000,
          country: this.country,
          currency: this.currency,
          reusable: true,
        }),
      })) as {
        object: 'list';
        pagination: Pagination;
        data: PaymentMethodType[];
      };
      this.methods = response?.data || [];
      if (this.methods?.length) {
        this.selectedMethodId = this.methods?.[0]?.id;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
  render() {
    return (
      <sc-toggles collapsible={false} theme="container">
        {(this.methods || []).map(method => (
          <sc-toggle show-control shady borderless open={this.selectedMethodId === method?.id}>
            <span slot="summary" class="sc-payment-toggle-summary">
              {!!method?.image && <img src={method?.image} />}
              <span>{method?.description}</span>
            </span>

            <sc-card>
              <sc-payment-selected label={sprintf(__('%s selected.', 'surecart'), method?.description)}>
                {!!method?.image && <img slot="icon" src={method?.image} style={{ width: '32px' }} />}
                {__('Another step will appear after submitting your order to add this payment method.', 'surecart')}
              </sc-payment-selected>
            </sc-card>
          </sc-toggle>
        ))}
      </sc-toggles>
    );
  }
}
