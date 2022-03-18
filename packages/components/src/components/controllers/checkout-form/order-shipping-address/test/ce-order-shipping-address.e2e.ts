import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-shipping-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-shipping-address></ce-order-shipping-address>');

    const element = await page.find('ce-order-shipping-address');
    expect(element).toHaveClass('hydrated');
  });
});
