import { Component, Prop, h, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Customer, Address } from '../../../../types';
import apiFetch from '../../../../functions/fetch';

@Component({
  tag: 'ce-customer-edit',
  styleUrl: 'ce-customer-edit.scss',
  shadow: true,
})
export class CeCustomerEdit {
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
        path: `checkout-engine/v1/customers/${this.customer?.id}`,
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
        },
      });
      if (this.successUrl) {
        window.location.href = this.successUrl;
      } else {
        this.loading = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
      this.loading = false;
    }
  }

  render() {
    return (
      <ce-dashboard-module class="customer-edit" error={this.error}>
        <span slot="heading">
          {this.heading || __('Update Billing Details', 'checkout_engine')}{' '}
          {!this?.customer?.live_mode && (
            <ce-tag type="warning" size="small">
              {__('Test', 'checkout_engine')}
            </ce-tag>
          )}
        </span>

        <ce-card>
          <ce-form onCeFormSubmit={e => this.handleSubmit(e)}>
            <ce-input label={__('Billing Email', 'checkout_engine')} name="email" value={this.customer?.email} required />
            <ce-columns style={{ '--ce-column-spacing': 'var(--ce-spacing-medium)' }}>
              <ce-column>
                <ce-input label={__('Name', 'checkout_engine')} name="name" value={this.customer?.name} />
              </ce-column>
              <ce-column>
                <ce-input label={__('Phone', 'checkout_engine')} name="phone" value={this.customer?.phone} />
              </ce-column>
            </ce-columns>
            <div>
              <ce-address
                label={__('Shipping Address', 'checkout_engine')}
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
              ></ce-address>
            </div>
            <div>
              <ce-switch
                name="billing_matches_shipping"
                checked={this.customer?.billing_matches_shipping}
                onCeChange={e => {
                  this.customer = {
                    ...this.customer,
                    billing_matches_shipping: (e.target as HTMLCeSwitchElement).checked,
                  };
                }}
                value="on"
              >
                {__('Billing address same as shipping', 'checkout_engine')}
              </ce-switch>
            </div>

            <div style={{ display: this.customer?.billing_matches_shipping ? 'none' : 'block' }}>
              <ce-address
                label={__('Billing Address', 'checkout_engine')}
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
              ></ce-address>
            </div>

            <div>
              <ce-button type="primary" full submit>
                {__('Save', 'checkout_engine')}
              </ce-button>
            </div>
          </ce-form>
        </ce-card>
        {this.loading && <ce-block-ui spinner></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
