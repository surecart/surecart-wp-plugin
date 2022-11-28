import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Customer } from '../../../../types';
import { ScCustomerDetails } from '../sc-customer-details';

describe('sc-customer-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerDetails],
      template: () => (
        <sc-customer-details
          customer={{
            id: 'asdf',
            email: 'test@test.com',
            name: 'test',
            phone: '1234567890',
            billing_address: {
              name: 'test',
              line_1: 'line_1',
              line_2: 'line_2',
              city: 'city line',
              state: 'wi',
              postal_code: '53716',
              country: 'us',
            },
          } as Customer}
        >
          <span slot="heading">
            <slot name="heading">Showing Customer Info</slot>
          </span>
        </sc-customer-details>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
  it('has a loading state', async () => {
    const page = await newSpecPage({
      components: [ScCustomerDetails],
      template: () => (
        <sc-customer-details loading={true}>
          <span slot="heading">
            <slot name="heading">Test heading</slot>
          </span>
        </sc-customer-details>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('has an error state', async () => {
    const page = await newSpecPage({
      components: [ScCustomerDetails],
      template: () => (
        <sc-customer-details error={'testmessage'}>
          <span slot="heading">
            <slot name="heading">Test heading</slot>
          </span>
        </sc-customer-details>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('has an empty state', async () => {
    const page = await newSpecPage({
      components: [ScCustomerDetails],
      template: () => (
        <sc-customer-details>
          <span slot="heading">
            <slot name="heading">Test heading</slot>
          </span>
        </sc-customer-details>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
});
