import { newE2EPage } from '@stencil/core/testing';

describe('sc-format-date', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-format-date></sc-format-date>');

    const element = await page.find('sc-format-date');
    expect(element).toHaveClass('hydrated');
  });
});
