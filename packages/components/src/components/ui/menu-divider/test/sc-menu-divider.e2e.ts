import { newE2EPage } from '@stencil/core/testing';

describe('sc-menu-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-menu-divider></sc-menu-divider>');

    const element = await page.find('sc-menu-divider');
    expect(element).toHaveClass('hydrated');
  });
});
