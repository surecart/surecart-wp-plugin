import { newE2EPage } from '@stencil/core/testing';

describe('sc-tab-panel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-tab-panel></sc-tab-panel>');

    const element = await page.find('sc-tab-panel');
    expect(element).toHaveClass('hydrated');
  });
});
