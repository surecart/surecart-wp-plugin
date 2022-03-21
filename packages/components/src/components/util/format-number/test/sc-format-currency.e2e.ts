import { newE2EPage } from '@stencil/core/testing';

describe('sc-format-number', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-format-number></sc-format-number>');

    const element = await page.find('sc-format-number');
    expect(element).toHaveClass('hydrated');
  });
});
