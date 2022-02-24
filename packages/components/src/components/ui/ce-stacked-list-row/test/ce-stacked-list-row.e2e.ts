import { newE2EPage } from '@stencil/core/testing';

describe('ce-stacked-list-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-stacked-list-row></ce-stacked-list-row>');

    const element = await page.find('ce-stacked-list-row');
    expect(element).toHaveClass('hydrated');
  });
});
