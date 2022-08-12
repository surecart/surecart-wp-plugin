import { newE2EPage } from '@stencil/core/testing';

describe('sc-cart-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-cart-icon></sc-cart-icon>');

    const element = await page.find('sc-cart-icon');
    expect(element).toHaveClass('hydrated');
  });
});
