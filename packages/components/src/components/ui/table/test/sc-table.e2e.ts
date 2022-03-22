import { newE2EPage } from '@stencil/core/testing';

describe('sc-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-table></sc-table>');

    const element = await page.find('sc-table');
    expect(element).toHaveClass('hydrated');
  });
});
