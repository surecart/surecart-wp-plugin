import { newE2EPage } from '@stencil/core/testing';

describe('sc-table-row', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-table-row></sc-table-row>');

    const element = await page.find('sc-table-row');
    expect(element).toHaveClass('hydrated');
  });
});
