import { newE2EPage } from '@stencil/core/testing';

describe('sc-provisional-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-provisional-banner></sc-provisional-banner>');

    const element = await page.find('sc-provisional-banner');
    expect(element).toHaveClass('hydrated');
  });
});
