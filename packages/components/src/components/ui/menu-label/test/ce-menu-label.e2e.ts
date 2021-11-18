import { newE2EPage } from '@stencil/core/testing';

describe('ce-menu-label', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-menu-label></ce-menu-label>');

    const element = await page.find('ce-menu-label');
    expect(element).toHaveClass('hydrated');
  });
});
