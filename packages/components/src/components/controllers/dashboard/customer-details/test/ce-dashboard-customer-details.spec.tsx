import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CeDashboardCustomerDetails } from '../ce-dashboard-customer-details';

describe('ce-customer-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeDashboardCustomerDetails],
      html: '<ce-dashboard-customer-details></ce-dashboard-customer-details>',
    });
    expect(page.root).toMatchSnapshot();
  });
});
