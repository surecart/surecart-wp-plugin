import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerDetails } from '../ce-customer-details';

describe('ce-customer-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerDetails],
      html: `<ce-customer-details></ce-customer-details>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
