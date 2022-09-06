import { newSpecPage } from '@stencil/core/testing';
import { ScDashboardCustomerDetails } from '../sc-dashboard-customer-details';

describe('sc-customer-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDashboardCustomerDetails],
      html: '<sc-dashboard-customer-details customer-id="asdf"></sc-dashboard-customer-details>',
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders empty if no customer id', async () => {
    const page = await newSpecPage({
      components: [ScDashboardCustomerDetails],
      html: '<sc-dashboard-customer-details></sc-dashboard-customer-details>',
    });
    expect(page.root).toMatchSnapshot();
  });
});
