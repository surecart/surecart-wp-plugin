import { newE2EPage } from '@stencil/core/testing';

describe('ce-menu-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-menu-divider></ce-menu-divider>');

    const element = await page.find('ce-menu-divider');
    expect(element).toHaveClass('hydrated');
  });
});
