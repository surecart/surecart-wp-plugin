import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-price-choices></sc-product-price-choices>');

    const element = await page.find('sc-product-price-choices');
    expect(element).toHaveClass('hydrated');
  });
});
