import { newE2EPage } from '@stencil/core/testing';

describe('ce-breadcrumbs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-breadcrumbs></ce-breadcrumbs>');

    const element = await page.find('ce-breadcrumbs');
    expect(element).toHaveClass('hydrated');
  });
});
