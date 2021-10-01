import { newE2EPage } from '@stencil/core/testing';

describe('ce-format-number', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-format-number></ce-format-number>');

    const element = await page.find('ce-format-number');
    expect(element).toHaveClass('hydrated');
  });
});
