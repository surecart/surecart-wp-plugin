import { newE2EPage } from '@stencil/core/testing';

describe('ce-table-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-table-row></ce-table-row>');

    const element = await page.find('ce-table-row');
    expect(element).toHaveClass('hydrated');
  });
});
