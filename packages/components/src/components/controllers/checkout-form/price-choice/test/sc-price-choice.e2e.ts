import { newE2EPage } from '@stencil/core/testing';

describe('sc-price-choice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-price-choice></sc-price-choice>');

    const element = await page.find('sc-price-choice');
    expect(element).toHaveClass('hydrated');
  });
});
