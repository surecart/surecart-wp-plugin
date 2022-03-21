import { newSpecPage } from '@stencil/core/testing';
import { ScOrderShippingAddress } from '../sc-order-shipping-address';

describe('sc-order-shipping-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      html: `<sc-order-shipping-address></sc-order-shipping-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
