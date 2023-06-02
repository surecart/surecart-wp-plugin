import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-quantity', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-quantity></sc-product-quantity>');

    const element = await page.find('sc-product-quantity');
    expect(element).toHaveClass('hydrated');
  });
});
