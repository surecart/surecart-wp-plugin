import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-input></ce-price-input>');

    const element = await page.find('ce-price-input');
    expect(element).toHaveClass('hydrated');
  });
});
