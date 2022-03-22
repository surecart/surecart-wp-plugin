import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerEmail } from '../sc-customer-email';

describe('sc-customer-email', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerEmail],
      html: `<sc-customer-email></sc-customer-email>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('is disabled when logged in', async () => {
    const page = await newSpecPage({
      components: [ScCustomerEmail],
      html: `<sc-customer-email logged-in></sc-customer-email>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
