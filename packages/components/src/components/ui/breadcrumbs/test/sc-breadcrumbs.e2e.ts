import { newE2EPage } from '@stencil/core/testing';

describe('sc-breadcrumbs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-breadcrumbs></sc-breadcrumbs>');

    const element = await page.find('sc-breadcrumbs');
    expect(element).toHaveClass('hydrated');
  });
});
