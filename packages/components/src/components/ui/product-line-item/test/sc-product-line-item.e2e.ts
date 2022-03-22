import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-line-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-line-item></sc-product-line-item>');

    const element = await page.find('sc-product-line-item');
    expect(element).toHaveClass('hydrated');
  });
});
