import { Component, Element, Fragment, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Address, Customer } from '../../../types';
import { formatAddress } from 'localized-address-format';
import { countryChoices } from '../../../functions/address';
import { zones } from '../../../functions/tax';

@Component({
  tag: 'ce-customer-details',
  styleUrl: 'ce-customer-details.css',
  shadow: true,
})
export class CeCustomerDetails {
  @Element() el: HTMLCeCustomerDetailsElement;
  @Prop() heading: string;
  @Prop() editLink: string;
  @Prop() customer: Customer;
  @Prop() loading: boolean;
  @Prop() error: string;

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
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Billing Name', 'checkout_engine')}</strong>
            </div>
            <div>{this.customer?.name}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {!!this?.customer?.email && (
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Billing Email', 'checkout_engine')}</strong>
            </div>
            <div>{this.customer?.email}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {!!Object.keys(this?.customer?.shipping_address || {}).length && this.renderAddress(__('Shipping Address', 'checkout_engine'), this.customer.shipping_address)}
        {!!Object.keys(this?.customer?.billing_address || {}).length && this.renderAddress(__('Billing Address', 'checkout_engine'), this.customer.billing_address)}
        {!!this?.customer?.phone && (
          <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
            <div>
              <strong>{__('Phone', 'checkout_engine')}</strong>
            </div>
            <div>{this.customer?.phone}</div>
            <div></div>
          </ce-stacked-list-row>
        )}
        {(() => {
          const { number_type, number } = this.customer?.tax_identifier || {};
          if (!number || !number_type) return;
          const label = zones?.[number_type]?.label || __('Tax Id', 'checkout_engine');
          const isInvalid = this.customer?.tax_identifier?.[`valid_${number_type}`] === false;
          return (
            <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
              <div>
                <strong>{label}</strong>
              </div>
              <div>
                {number} {isInvalid && <ce-tag type="warning">{__('Invalid', 'checkout_engine')}</ce-tag>}
              </div>
              <div></div>
            </ce-stacked-list-row>
          );
        })()}
      </Fragment>
    );
  }

  renderAddress(label: string = 'Address', address: Address) {
    const { line_1, line_2, city, state, postal_code, country } = address;
    const countryName = countryChoices.find(({ value }) => value === country)?.label;
    return (
      <ce-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
        <div>
          <strong>{label}</strong>
        </div>
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
          {!this?.customer?.live_mode === false && (
            <ce-tag type="warning" size="small">
              {__('Test', 'checkout_engine')}
            </ce-tag>
          )}
        </span>

        {this.editLink && (
          <ce-button type="link" href={this.editLink} slot="end">
            <ce-icon name="edit-3" slot="prefix"></ce-icon>
            {__('Update', 'checkout_engine')}
          </ce-button>
        )}

        <ce-card no-padding>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
      </ce-dashboard-module>
    );
  }
}
