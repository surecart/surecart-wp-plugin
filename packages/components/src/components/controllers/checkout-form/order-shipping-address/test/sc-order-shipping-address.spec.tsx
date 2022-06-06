import { h } from '@stencil/core';
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

  it('renders full fields if shipping is enabled', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address shippingEnabled={true}></sc-order-shipping-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders full fields loading if shipping is enabled', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address shippingEnabled={true} loading={true}></sc-order-shipping-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders compact fields if shipping is not enabled', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address shippingEnabled={false}></sc-order-shipping-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders compact fields loading if shipping is not enabled', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address shippingEnabled={false} loading={true}></sc-order-shipping-address>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
