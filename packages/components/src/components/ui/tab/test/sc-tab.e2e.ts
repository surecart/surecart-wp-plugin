import { newE2EPage } from '@stencil/core/testing';

describe('sc-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-tab></sc-tab>');

    const element = await page.find('sc-tab');
    expect(element).toHaveClass('hydrated');
  });
});
