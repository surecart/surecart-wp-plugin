import { newE2EPage } from '@stencil/core/testing';

describe('ce-format-date', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-format-date></ce-format-date>');

    const element = await page.find('ce-format-date');
    expect(element).toHaveClass('hydrated');
  });
});
