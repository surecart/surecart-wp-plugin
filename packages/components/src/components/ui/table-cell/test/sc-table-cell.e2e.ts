import { newE2EPage } from '@stencil/core/testing';

describe('sc-table-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-table-cell></sc-table-cell>');

    const element = await page.find('sc-table-cell');
    expect(element).toHaveClass('hydrated');
  });
});
