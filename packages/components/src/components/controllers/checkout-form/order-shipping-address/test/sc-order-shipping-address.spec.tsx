import { ScOrderShippingAddress } from '../sc-order-shipping-address';
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

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

  it('is required if required is false but shipping enabled is true', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address required={false} shippingEnabled={true}></sc-order-shipping-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('is required if required is false but tax enabled is true', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address required={false} taxEnabled={true}></sc-order-shipping-address>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('is required if required is false but tax is later enabled', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address required={false}></sc-order-shipping-address>,
    });
    page.root.taxEnabled = true;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('is required if required is false but shipping is later enabled', async () => {
    const page = await newSpecPage({
      components: [ScOrderShippingAddress],
      template: () => <sc-order-shipping-address required={false}></sc-order-shipping-address>,
    });
    page.root.shippingEnabled = true;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
