import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerName } from '../sc-customer-lastname';

describe('sc-customer-name', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerName],
      html: `<sc-customer-name></sc-customer-name>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('is disabled when logged in', async () => {
    const page = await newSpecPage({
      components: [ScCustomerName],
      html: `<sc-customer-name logged-in></sc-customer-name>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
