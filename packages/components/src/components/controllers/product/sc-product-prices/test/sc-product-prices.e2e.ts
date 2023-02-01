import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-prices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-prices></sc-product-prices>');

    const element = await page.find('sc-product-prices');
    expect(element).toHaveClass('hydrated');
  });
});
