import { newE2EPage } from '@stencil/core/testing';

describe('ce-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-table></ce-table>');

    const element = await page.find('ce-table');
    expect(element).toHaveClass('hydrated');
  });
});
