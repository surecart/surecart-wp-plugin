import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');
    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });
});
