import { newE2EPage } from '@stencil/core/testing';

describe('sc-rich-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-rich-text></sc-rich-text>');

    const element = await page.find('sc-rich-text');
    expect(element).toHaveClass('hydrated');
  });
});
