import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-image-carousel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-image-carousel></sc-product-image-carousel>');

    const element = await page.find('sc-product-image-carousel');
    expect(element).toHaveClass('hydrated');
  });
});
