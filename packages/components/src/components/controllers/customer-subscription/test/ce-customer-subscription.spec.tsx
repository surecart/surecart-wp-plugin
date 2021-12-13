import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerSubscription } from '../ce-customer-subscription';

describe('ce-customer-subscription', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerSubscription],
      html: `<ce-customer-subscription></ce-customer-subscription>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
