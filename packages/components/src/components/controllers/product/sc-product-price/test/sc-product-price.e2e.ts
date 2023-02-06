import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-prices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-price></sc-product-price>');

    const element = await page.find('sc-product-price');
    expect(element).toHaveClass('hydrated');
  });
});
