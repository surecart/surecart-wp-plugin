import { Component, Element, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { Customer } from '../../../../types';

@Component({
  tag: 'sc-dashboard-customer-details',
  styleUrl: 'sc-dashboard-customer-details.css',
  shadow: true,
})
export class ScDashboardCustomerDetails {
  @Element() el: HTMLScCustomerDetailsElement;
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
        path: addQueryArgs(`surecart/v1/customers/${this.customerId}`, {
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
      <sc-customer-details
        customer={this.customer}
        loading={this.loading}
        error={this.error}
        heading={this.heading}
        edit-link={addQueryArgs(window.location.href, {
          action: 'edit',
          model: 'customer',
          id: this.customerId,
        })}
      ></sc-customer-details>
    );
  }
}
