import { newE2EPage } from '@stencil/core/testing';

describe('ce-breadcrumb', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-breadcrumb></ce-breadcrumb>');

    const element = await page.find('ce-breadcrumb');
    expect(element).toHaveClass('hydrated');
  });
});
