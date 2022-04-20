import { newE2EPage } from '@stencil/core/testing';

describe('sc-cart-line-items', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-cart-line-items></sc-cart-line-items>');

    const element = await page.find('sc-cart-line-items');
    expect(element).toHaveClass('hydrated');
  });
});
