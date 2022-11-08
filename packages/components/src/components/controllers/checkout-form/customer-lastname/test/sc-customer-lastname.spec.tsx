import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerLastname } from '../sc-customer-lastname';

describe('sc-customer-lastname', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerLastname],
      html: `<sc-customer-lastname></sc-customer-lastname>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('is disabled when logged in', async () => {
    const page = await newSpecPage({
      components: [ScCustomerLastname],
      html: `<sc-customer-lastname logged-in></sc-customer-lastname>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
