import { Component, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Customer } from '../../../../types';

@Component({
  tag: 'ce-customer-edit',
  styleUrl: 'ce-customer-edit.scss',
  shadow: true,
})
export class CeCustomerEdit {
  @Prop() header: string;
  @Prop() customer: Customer;

  render() {
    return (
      <div
        class={{
          'customer-edit': true,
        }}
      >
        <ce-heading>{this.header || __('Update Billing Details', 'checkout_engine')}</ce-heading>

        <ce-card style={{ '--overflow': 'hidden' }}>
          <ce-input label={__('Email', 'checkout_engine')} name="email" value={this.customer?.email} />
          <ce-columns style={{ '--ce-column-spacing': 'var(--ce-spacing-medium)' }}>
            <ce-column>
              <ce-input label={__('Name', 'checkout_engine')} name="name" value={this.customer?.name} />
            </ce-column>
            <ce-column>
              <ce-input label={__('Phone', 'checkout_engine')} name="phone" value={this.customer?.phone} />
            </ce-column>
          </ce-columns>
          <div>
            <ce-address label={__('Shipping Address', 'checkout_engine')}></ce-address>
          </div>
          <div>
            <ce-switch name="billing_matches_shipping" value="on">
              {__('Billing address same as shipping', 'checkout_engine')}
            </ce-switch>
          </div>
          <div>
            <ce-address label={__('Billing Address', 'checkout_engine')}></ce-address>
          </div>
          <div>
            <ce-button type="primary" full submit>
              {__('Save', 'checkout_engine')}
            </ce-button>
          </div>
        </ce-card>
      </div>
    );
  }
}
