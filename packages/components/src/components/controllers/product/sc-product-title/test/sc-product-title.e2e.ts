import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-title', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-title></sc-product-title>');

    const element = await page.find('sc-product-title');
    expect(element).toHaveClass('hydrated');
  });
});
