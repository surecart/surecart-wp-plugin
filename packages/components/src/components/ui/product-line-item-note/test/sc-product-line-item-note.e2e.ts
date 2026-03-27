import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-line-item-note', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-line-item-note></sc-product-line-item-note>');

    const element = await page.find('sc-product-line-item-note');
    expect(element).toHaveClass('hydrated');
  });
});
