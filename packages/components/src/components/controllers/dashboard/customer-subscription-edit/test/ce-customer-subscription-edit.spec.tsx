import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerSubscriptionEdit } from '../ce-customer-subscription-edit';

describe('ce-customer-subscription', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerSubscriptionEdit],
      html: `<ce-customer-subscription></ce-customer-subscription>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
