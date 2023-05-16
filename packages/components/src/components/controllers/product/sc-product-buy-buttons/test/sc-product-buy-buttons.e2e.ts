import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-buy-buttons', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-buy-buttons></sc-product-buy-buttons>');

    const element = await page.find('sc-product-buy-buttons');
    expect(element).toHaveClass('hydrated');
  });
});
