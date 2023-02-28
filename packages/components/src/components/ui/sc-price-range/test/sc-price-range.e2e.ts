import { newE2EPage } from '@stencil/core/testing';
import { Price } from '../../../../types';

describe('sc-price-range', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-price-range></sc-price-range>');
    const element = await page.find('sc-price-range');
    expect(element).toHaveClass('hydrated');
  });
});
