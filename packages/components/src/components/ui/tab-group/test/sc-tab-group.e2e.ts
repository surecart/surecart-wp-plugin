import { newE2EPage } from '@stencil/core/testing';

describe('sc-tab-group', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-tab-group></sc-tab-group>');

    const element = await page.find('sc-tab-group');
    expect(element).toHaveClass('hydrated');
  });
});
