import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerDashboard } from '../ce-customer-dashboard';

describe('ce-customer-dashboard', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerDashboard],
      html: `<ce-customer-dashboard></ce-customer-dashboard>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
