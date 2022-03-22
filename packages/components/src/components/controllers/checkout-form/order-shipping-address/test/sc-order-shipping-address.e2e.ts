import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-shipping-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address></sc-order-shipping-address>');

    const element = await page.find('sc-order-shipping-address');
    expect(element).toHaveClass('hydrated');
  });
});
