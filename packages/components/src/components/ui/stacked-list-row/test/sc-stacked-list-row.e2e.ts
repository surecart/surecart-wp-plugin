import { newE2EPage } from '@stencil/core/testing';

describe('sc-stacked-list-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-stacked-list-row></sc-stacked-list-row>');

    const element = await page.find('sc-stacked-list-row');
    expect(element).toHaveClass('hydrated');
  });
});
