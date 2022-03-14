import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerEdit } from '../ce-customer-edit';

describe('ce-customer-edit', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerEdit],
      html: `<ce-customer-edit></ce-customer-edit>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
