import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-chooser', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-chooser></ce-price-chooser>');

    const element = await page.find('ce-price-chooser');
    expect(element).toHaveClass('hydrated');
  });
});
