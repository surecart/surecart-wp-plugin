import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-selector', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-selector></ce-price-selector>');

    const element = await page.find('ce-price-selector');
    expect(element).toHaveClass('hydrated');
  });
});
