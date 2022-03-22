import { newE2EPage } from '@stencil/core/testing';

describe('sc-price-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-price-input></sc-price-input>');

    const element = await page.find('sc-price-input');
    expect(element).toHaveClass('hydrated');
  });
});
