import { Component, Element, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { onFirstVisible } from '../../../../functions/lazy';
import { Address, Customer } from '../../../../types';
import { formatAddress } from 'localized-address-format';
import { countryChoices } from '../../../../functions/address';

@Component({
  tag: 'ce-customer-details',
  styleUrl: 'ce-customer-details.css',
  shadow: true,
})
export class CeCustomerDetails {
  @Element() el: HTMLCeCustomerDetailsElement;
  @Prop() customerId: string;
  @Prop() heading: string;
  @State() customer: Customer;
  @State() loading: boolean;
  @State() error: string;

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.customer) {
      return this.renderEmpty();
    }

    return (
      <Fragment>
        {!!this?.customer?.name && (
          <ce-stacked-list-row style={{ '--columns': '3' }}>
            <div>{__('Name', 'checkout_engine')}</div>
            <div>{this.customer?.name}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {!!this?.customer?.email && (
          <ce-stacked-list-row style={{ '--columns': '3' }}>
            <div>{__('Billing Email', 'checkout_engine')}</div>
            <div>{this.customer?.email}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {!!Object.keys(this?.customer?.shipping_address || {}).length && this.renderAddress(__('Shipping Address', 'checkout_engine'), this.customer.shipping_address)}
        {!!Object.keys(this?.customer?.billing_address || {}).length && this.renderAddress(__('Billing Address', 'checkout_engine'), this.customer.billing_address)}
        {!!this?.customer?.phone && (
          <ce-stacked-list-row style={{ '--columns': '3' }}>
            <div>{__('Phone', 'checkout_engine')}</div>
            <div>{this.customer?.phone}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
      </Fragment>
    );
  }

  renderAddress(label: string = 'Address', address: Address) {
    const { line_1, line_2, city, state, postal_code, country } = address;
    const countryName = countryChoices.find(({ value }) => value === country)?.label;
    return (
      <ce-stacked-list-row style={{ '--columns': '3' }}>
        <div>{label}</div>
        <div>
          {formatAddress({
            postalCountry: country,
            administrativeArea: state,
            locality: city,
            postalCode: postal_code,
            addressLines: [line_1, line_2],
          }).join('\n') +
            '\n' +
            countryName || country}
        </div>
      </ce-stacked-list-row>
    );
  }

  renderEmpty() {
    return <slot name="empty">{__('You are not a customer.', 'checkout_engine')}</slot>;
  }

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
          expand: ['shipping_address', 'billing_address'],
        }),
      })) as Customer;
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

  render() {
    return (
      <ce-dashboard-module class="customer-details" error={this.error}>
        <span slot="heading">
          {this.heading || __('Billing Details', 'checkout_engine')}{' '}
          {!this?.customer?.live_mode && (
            <ce-tag type="warning" size="small">
              {__('Test', 'checkout_engine')}
            </ce-tag>
          )}
        </span>

        <ce-button
          type="link"
          href={addQueryArgs(window.location.href, {
            action: 'edit',
            model: 'customer',
          })}
          slot="end"
        >
          <ce-icon name="edit-3" slot="prefix"></ce-icon>
          {__('Update', 'checkout_engine')}
        </ce-button>

        <ce-card no-padding>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
      </ce-dashboard-module>
    );
  }
}
