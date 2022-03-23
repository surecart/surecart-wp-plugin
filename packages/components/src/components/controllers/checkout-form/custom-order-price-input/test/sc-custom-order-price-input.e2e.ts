import { newE2EPage } from '@stencil/core/testing';

describe('sc-custom-order-price-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-custom-order-price-input></sc-custom-order-price-input>');

    const element = await page.find('sc-custom-order-price-input');
    expect(element).toHaveClass('hydrated');
  });
});
