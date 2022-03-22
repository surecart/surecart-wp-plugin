import { newE2EPage } from '@stencil/core/testing';

describe('sc-stacked-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-stacked-list></sc-stacked-list>');

    const element = await page.find('sc-stacked-list');
    expect(element).toHaveClass('hydrated');
  });
});
