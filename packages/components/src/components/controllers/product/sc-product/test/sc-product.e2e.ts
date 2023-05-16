import { newE2EPage } from '@stencil/core/testing';

describe('sc-product', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product></sc-product>');

    const element = await page.find('sc-product');
    expect(element).toHaveClass('hydrated');
  });
});
