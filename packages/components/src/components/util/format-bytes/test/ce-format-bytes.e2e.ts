import { newE2EPage } from '@stencil/core/testing';

describe('ce-format-bytes', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-format-bytes></ce-format-bytes>');

    const element = await page.find('ce-format-bytes');
    expect(element).toHaveClass('hydrated');
  });
});
