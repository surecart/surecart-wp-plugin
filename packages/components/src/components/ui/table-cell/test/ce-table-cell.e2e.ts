import { newE2EPage } from '@stencil/core/testing';

describe('ce-table-cell', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-table-cell></ce-table-cell>');

    const element = await page.find('ce-table-cell');
    expect(element).toHaveClass('hydrated');
  });
});
