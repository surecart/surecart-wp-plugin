import { newE2EPage } from '@stencil/core/testing';

describe('sc-breadcrumb', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-breadcrumb></sc-breadcrumb>');

    const element = await page.find('sc-breadcrumb');
    expect(element).toHaveClass('hydrated');
  });
});
