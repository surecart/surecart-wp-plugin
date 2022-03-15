import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerName } from '../ce-customer-name';

describe('ce-customer-name', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerName],
      html: `<ce-customer-name></ce-customer-name>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('is disabled when logged in', async () => {
    const page = await newSpecPage({
      components: [CeCustomerName],
      html: `<ce-customer-name logged-in></ce-customer-name>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
