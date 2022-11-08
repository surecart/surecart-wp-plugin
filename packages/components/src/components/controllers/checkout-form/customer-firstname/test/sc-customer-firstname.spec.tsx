import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerFirstname } from '../sc-customer-firstname';

describe('sc-customer-firstname', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerFirstname],
      html: `<sc-customer-firstname></sc-customer-firstname>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('is disabled when logged in', async () => {
    const page = await newSpecPage({
      components: [ScCustomerFirstname],
      html: `<sc-customer-firstname logged-in></sc-customer-firstname>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
