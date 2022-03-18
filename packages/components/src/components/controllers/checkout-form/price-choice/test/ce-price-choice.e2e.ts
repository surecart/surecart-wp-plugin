import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-choice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choice></ce-price-choice>');

    const element = await page.find('ce-price-choice');
    expect(element).toHaveClass('hydrated');
  });
});
