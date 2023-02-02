import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-image', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-image></sc-product-image>');

    const element = await page.find('sc-product-image');
    expect(element).toHaveClass('hydrated');
  });
});
