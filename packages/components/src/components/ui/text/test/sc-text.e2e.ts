import { newE2EPage } from '@stencil/core/testing';

describe('sc-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-text></sc-text>');

    const element = await page.find('sc-text');
    expect(element).toHaveClass('hydrated');
  });
});
