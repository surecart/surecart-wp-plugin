import { newE2EPage } from '@stencil/core/testing';

describe('ce-cart-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-cart-provider></ce-cart-provider>');

    const element = await page.find('ce-cart-provider');
    expect(element).toHaveClass('hydrated');
  });
});
