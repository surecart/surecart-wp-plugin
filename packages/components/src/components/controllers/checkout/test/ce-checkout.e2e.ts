import { newE2EPage } from '@stencil/core/testing';
import priceResponse from './fixtures/prices.js';

describe('ce-checkout', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-checkout></ce-checkout>');

    const element = await page.find('ce-checkout');
    expect(element).toHaveClass('hydrated');
  });
});
