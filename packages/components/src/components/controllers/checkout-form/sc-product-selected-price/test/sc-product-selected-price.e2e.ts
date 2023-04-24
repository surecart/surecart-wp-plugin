import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-selected-price', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-selected-price></sc-product-selected-price>');

    const element = await page.find('sc-product-selected-price');
    expect(element).toHaveClass('hydrated');
  });
});
