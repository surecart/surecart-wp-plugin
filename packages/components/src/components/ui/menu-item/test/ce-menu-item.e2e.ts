import { newE2EPage } from '@stencil/core/testing';

describe('ce-menu-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-menu-item></ce-menu-item>');

    const element = await page.find('ce-menu-item');
    expect(element).toHaveClass('hydrated');
  });
});
