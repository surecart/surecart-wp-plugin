import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerOrdersList } from '../ce-customer-orders-list';

describe('ce-customer-orders-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerOrdersList],
      html: `<ce-customer-orders-list></ce-customer-orders-list>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
