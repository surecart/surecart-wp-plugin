import { newE2EPage } from '@stencil/core/testing';

describe('sc-feature-demo-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-feature-demo-banner></sc-feature-demo-banner>');

    const element = await page.find('sc-feature-demo-banner');
    expect(element).toHaveClass('hydrated');
  });
});
