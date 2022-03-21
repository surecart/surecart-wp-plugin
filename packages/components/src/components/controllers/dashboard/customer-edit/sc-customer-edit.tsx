import { Component, Prop, h, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Customer, Address } from '../../../../types';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';

@Component({
  tag: 'sc-customer-edit',
  styleUrl: 'sc-customer-edit.scss',
  shadow: true,
})
export class ScCustomerEdit {
  @Prop() heading: string;
  @Prop({ mutable: true }) customer: Customer;
  @Prop() successUrl: string;

  @State() loading: boolean;
  @State() error: string;

  async handleSubmit(e) {
    this.loading = true;
    try {
      const {
        email,
        name,
        phone,
        billing_matches_shipping,
        shipping_city,
        'tax_identifier.number_type': tax_identifier_number_type,
        'tax_identifier.number': tax_identifier_number,
        shipping_country,
        shipping_line_1,
        shipping_postal_code,
        shipping_state,
        billing_city,
        billing_country,
        billing_line_1,
        billing_postal_code,
        billing_state,
      } = await e.target.getFormJson();
      await apiFetch({
        path: addQueryArgs(`surecart/v1/customers/${this.customer?.id}`, { expand: ['tax_identifier'] }),
        method: 'PATCH',
        data: {
          email,
          name,
          phone,
          billing_matches_shipping: billing_matches_shipping === 'on',
          shipping_address: {
            city: shipping_city,
            country: shipping_country,
            line_1: shipping_line_1,
            postal_code: shipping_postal_code,
            state: shipping_state,
          },
          billing_address: {
            city: billing_city,
            country: billing_country,
            line_1: billing_line_1,
            postal_code: billing_postal_code,
            state: billing_state,
          },
          ...(tax_identifier_number && tax_identifier_number_type
            ? {
                tax_identifier: {
                  number: tax_identifier_number,
                  number_type: tax_identifier_number_type,
                },
              }
            : {}),
        },
      });
      if (this.successUrl) {
        window.location.assign(this.successUrl);
      } else {
        this.loading = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.loading = false;
    }
  }

  render() {
    return (
      <sc-dashboard-module class="customer-edit" error={this.error}>
        <span slot="heading">
          {this.heading || __('Update Billing Details', 'surecart')}{' '}
          {!this?.customer?.live_mode === false && (
            <sc-tag type="warning" size="small">
              {__('Test', 'surecart')}
            </sc-tag>
          )}
        </span>

        <sc-card>
          <sc-form onScFormSubmit={e => this.handleSubmit(e)}>
            <sc-input label={__('Billing Email', 'surecart')} name="email" value={this.customer?.email} required />

            <sc-columns style={{ '--sc-column-spacing': 'var(--sc-spacing-medium)' }}>
              <sc-column>
                <sc-input label={__('Name', 'surecart')} name="name" value={this.customer?.name} />
              </sc-column>
              <sc-column>
                <sc-input label={__('Phone', 'surecart')} name="phone" value={this.customer?.phone} />
              </sc-column>
            </sc-columns>
            <div>
              <sc-address
                label={__('Shipping Address', 'surecart')}
                address={{
                  ...(this.customer?.shipping_address as Address),
                }}
                required={false}
                names={{
                  country: 'shipping_country',
                  line_1: 'shipping_line_1',
                  line_2: 'shipping_line_2',
                  city: 'shipping_city',
                  postal_code: 'shipping_postal_code',
                  state: 'shipping_state',
                }}
              ></sc-address>
            </div>

            <div>
              <sc-switch
                name="billing_matches_shipping"
                checked={this.customer?.billing_matches_shipping}
                onScChange={e => {
                  this.customer = {
                    ...this.customer,
                    billing_matches_shipping: (e.target as HTMLScSwitchElement).checked,
                  };
                }}
                value="on"
              >
                {__('Billing address same as shipping', 'surecart')}
              </sc-switch>
            </div>

            <div style={{ display: this.customer?.billing_matches_shipping ? 'none' : 'block' }}>
              <sc-address
                label={__('Billing Address', 'surecart')}
                address={{
                  ...(this.customer?.billing_address as Address),
                }}
                names={{
                  country: 'billing_country',
                  line_1: 'billing_line_1',
                  line_2: 'billing_line_2',
                  city: 'billing_city',
                  postal_code: 'billing_postal_code',
                  state: 'billing_state',
                }}
                required={false}
              ></sc-address>
            </div>

            <sc-tax-id-input show number={this.customer?.tax_identifier?.number} type={this.customer?.tax_identifier?.number_type}></sc-tax-id-input>

            <div>
              <sc-button type="primary" full submit>
                {__('Save', 'surecart')}
              </sc-button>
            </div>
          </sc-form>
        </sc-card>
        {this.loading && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
