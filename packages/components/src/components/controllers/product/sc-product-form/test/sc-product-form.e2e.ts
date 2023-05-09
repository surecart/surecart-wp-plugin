import { newE2EPage } from '@stencil/core/testing';

describe('sc-product-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-product-form></sc-product-form>');

    const element = await page.find('sc-product-form');
    expect(element).toHaveClass('hydrated');
  });
});
