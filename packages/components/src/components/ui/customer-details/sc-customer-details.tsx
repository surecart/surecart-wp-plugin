import { Component, Element, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Address, Customer } from '../../../types';
import { formatAddress } from 'localized-address-format';
import { countryChoices } from '../../../functions/address';
import { zones } from '../../../functions/tax';

/**
 * @part base - The elements base wrapper.
 * @part heading - The heading.
 * @part heading-text - The heading text wrapper.
 * @part heading-title - The heading title.
 * @part heading-description - The heading description.
 * @part error__base - The elements base wrapper.
 * @part error__icon - The alert icon.
 * @part error__text - The alert text.
 * @part error__title - The alert title.
 * @part error__ message - The alert message.
 * @part test-tag__base - The base test tag.
 * @part text-tag__content - The base test tag content.
 * @part button__base - The button base.
 * @part button__label - The button label.
 * @part button__prefix - The button prefix.
 */
@Component({
  tag: 'sc-customer-details',
  styleUrl: 'sc-customer-details.css',
  shadow: true,
})
export class ScCustomerDetails {
  @Element() el: HTMLScCustomerDetailsElement;
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
      <sc-card no-padding>
        <sc-stacked-list>
          {!!this?.customer?.name && (
            <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
              <div>
                <strong>{__('Billing Name', 'surecart')}</strong>
              </div>
              <div>{this.customer?.name}</div>
              <div></div>
              {/** Needed for formatting */}
            </sc-stacked-list-row>
          )}
          {!!this?.customer?.email && (
            <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
              <div>
                <strong>{__('Billing Email', 'surecart')}</strong>
              </div>
              <div>{this.customer?.email}</div>
              <div></div>
            </sc-stacked-list-row>
          )}
          {!!Object.keys(this?.customer?.shipping_address || {}).length && this.renderAddress(__('Shipping Address', 'surecart'), this.customer.shipping_address)}
          {!!Object.keys(this?.customer?.billing_address || {}).length && this.renderAddress(__('Billing Address', 'surecart'), this.customer.billing_address)}
          {!!this?.customer?.phone && (
            <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
              <div>
                <strong>{__('Phone', 'surecart')}</strong>
              </div>
              <div>{this.customer?.phone}</div>
              <div></div>
            </sc-stacked-list-row>
          )}
          {(() => {
            const { number_type, number } = this.customer?.tax_identifier || {};
            if (!number || !number_type) return;
            const label = zones?.[number_type]?.label || __('Tax Id', 'surecart');
            const isInvalid = this.customer?.tax_identifier?.[`valid_${number_type}`] === false;
            return (
              <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
                <div>
                  <strong>{label}</strong>
                </div>
                <div>
                  {number} {isInvalid && <sc-tag type="warning">{__('Invalid', 'surecart')}</sc-tag>}
                </div>
                <div></div>
              </sc-stacked-list-row>
            );
          })()}
        </sc-stacked-list>
      </sc-card>
    );
  }

  renderAddress(label: string = 'Address', address: Address) {
    const { name, line_1, line_2, city, state, postal_code, country } = address;
    const countryName = countryChoices.find(({ value }) => value === country)?.label;
    return (
      <sc-stacked-list-row style={{ '--columns': '3' }} mobileSize={480}>
        <div>
          <strong>{label}</strong>
        </div>
        <div>
          {formatAddress({
            name,
            postalCountry: country,
            administrativeArea: state,
            locality: city,
            postalCode: postal_code,
            addressLines: [line_1, line_2],
          }).join('\n') +
            '\n' +
            countryName || country}
        </div>
        <div></div>
      </sc-stacked-list-row>
    );
  }

  renderEmpty() {
    return (
      <div>
        <sc-divider style={{ '--spacing': '0' }}></sc-divider>
        <slot name="empty">
          <sc-empty icon="user">{__("You don't have any billing information.", 'surecart')}</sc-empty>
        </slot>
      </div>
    );
  }

  renderLoading() {
    return (
      <sc-card no-padding>
        <sc-stacked-list>
          <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
            <div style={{ padding: '0.5em' }}>
              <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
              <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
            </div>
          </sc-stacked-list-row>
        </sc-stacked-list>
      </sc-card>
    );
  }

  render() {
    return (
      <sc-dashboard-module exportparts="base, heading, heading-text, heading-title, heading-description" class="customer-details" error={this.error}>
        <span slot="heading">
          {this.heading || __('Billing Details', 'surecart')}{' '}
          {!!this?.customer?.id && !this?.customer?.live_mode && (
            <sc-tag exportparts="base:test-tag__base, content:test-tag__content" type="warning" size="small">
              {__('Test', 'surecart')}
            </sc-tag>
          )}
        </span>

        {!!this.editLink && !!this.customer?.id && (
          <sc-button exportparts="base:button__base, label:button__label, prefix:button__prefix" type="link" href={this.editLink} slot="end">
            <sc-icon name="edit-3" slot="prefix"></sc-icon>
            {__('Update', 'surecart')}
          </sc-button>
        )}

        {this.renderContent()}
      </sc-dashboard-module>
    );
  }
}
