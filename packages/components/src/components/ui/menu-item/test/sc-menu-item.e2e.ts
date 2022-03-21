import { newE2EPage } from '@stencil/core/testing';

describe('sc-menu-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-menu-item></sc-menu-item>');

    const element = await page.find('sc-menu-item');
    expect(element).toHaveClass('hydrated');
  });
});
