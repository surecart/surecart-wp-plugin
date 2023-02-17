import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-buy-page', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-buy-page></sc-product-buy-page>');

    const element = await page.find('sc-product-buy-page');
    expect(element).toHaveClass('hydrated');
  });
});
