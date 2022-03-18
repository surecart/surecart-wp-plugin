import { newSpecPage } from '@stencil/core/testing';
import { CeOrderShippingAddress } from '../ce-order-shipping-address';

describe('ce-order-shipping-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderShippingAddress],
      html: `<ce-order-shipping-address></ce-order-shipping-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
