import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { Customer } from '../../../../types';

@Component({
  tag: 'ce-dashboard-customer-details',
  styleUrl: 'ce-dashboard-customer-details.css',
  shadow: true,
})
export class CeDashboardCustomerDetails {
  @Element() el: HTMLCeCustomerDetailsElement;
  @Prop() customerId: string;
  @Prop() heading: string;
  @State() customer: Customer;
  @State() loading: boolean;
  @State() error: string;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.fetch();
    });
  }

  async fetch() {
    try {
      this.loading = true;
      this.customer = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/customers/${this.customerId}`, {
          expand: ['shipping_address', 'billing_address', 'tax_identifier'],
        }),
      })) as Customer;
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

  render() {
    return (
      <ce-customer-details
        customer={this.customer}
        loading={this.loading}
        error={this.error}
        edit-link={addQueryArgs(window.location.href, {
          action: 'edit',
          model: 'customer',
        })}
      ></ce-customer-details>
    );
  }
}
