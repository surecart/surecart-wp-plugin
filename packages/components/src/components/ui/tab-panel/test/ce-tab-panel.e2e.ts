import { newE2EPage } from '@stencil/core/testing';

describe('ce-tab-panel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tab-panel></ce-tab-panel>');

    const element = await page.find('ce-tab-panel');
    expect(element).toHaveClass('hydrated');
  });
});
