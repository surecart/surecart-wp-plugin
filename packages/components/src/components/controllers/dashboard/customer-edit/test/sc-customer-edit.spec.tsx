import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerEdit } from '../sc-customer-edit';

describe('sc-customer-edit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerEdit],
      html: `<sc-customer-edit></sc-customer-edit>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
