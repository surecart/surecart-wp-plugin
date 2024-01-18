import { ScOrderShippingAddress } from '../sc-order-shipping-address';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { state, dispose } from '@store/checkout';

describe('sc-order-shipping-address', () => {
  beforeEach(() => {
    dispose();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      html: `<sc-order-shipping-address></sc-order-shipping-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
