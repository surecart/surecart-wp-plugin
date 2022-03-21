import { newE2EPage } from '@stencil/core/testing';

describe('sc-menu-label', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-menu-label></sc-menu-label>');

    const element = await page.find('sc-menu-label');
    expect(element).toHaveClass('hydrated');
  });
});
