import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerOrders } from '../ce-customer-order';

describe('ce-customer-orders', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerOrders],
      html: `<ce-customer-orders></ce-customer-orders>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
