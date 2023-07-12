import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-collection-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-collection-badge></sc-product-collection-badge>');

    const element = await page.find('sc-product-collection-badge');
    expect(element).toHaveClass('hydrated');
  });
});
