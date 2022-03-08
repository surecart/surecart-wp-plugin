import { newE2EPage } from '@stencil/core/testing';

describe('ce-stacked-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-stacked-list></ce-stacked-list>');

    const element = await page.find('ce-stacked-list');
    expect(element).toHaveClass('hydrated');
  });
});
