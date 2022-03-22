import { newE2EPage } from '@stencil/core/testing';

describe('sc-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-price-choices></sc-price-choices>');
    const element = await page.find('sc-price-choices');
    expect(element).toHaveClass('hydrated');
  });
});
