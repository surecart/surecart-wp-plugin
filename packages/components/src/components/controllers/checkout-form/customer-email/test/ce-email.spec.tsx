import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerEmail } from '../ce-customer-email';

describe('ce-customer-email', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerEmail],
      html: `<ce-customer-email></ce-customer-email>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('is disabled when logged in', async () => {
    const page = await newSpecPage({
      components: [CeCustomerEmail],
      html: `<ce-customer-email logged-in></ce-customer-email>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
