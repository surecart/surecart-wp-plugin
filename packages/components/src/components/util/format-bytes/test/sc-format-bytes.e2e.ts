import { newE2EPage } from '@stencil/core/testing';

describe('sc-format-bytes', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-format-bytes></sc-format-bytes>');

    const element = await page.find('sc-format-bytes');
    expect(element).toHaveClass('hydrated');
  });
});
