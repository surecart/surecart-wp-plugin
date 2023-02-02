import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-text></sc-product-text>');

    const element = await page.find('sc-product-text');
    expect(element).toHaveClass('hydrated');
  });
});
