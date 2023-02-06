import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-buy-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-buy-button></sc-product-buy-button>');

    const element = await page.find('sc-product-buy-button');
    expect(element).toHaveClass('hydrated');
  });
});
