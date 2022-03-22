import { newE2EPage } from '@stencil/core/testing';

describe('sc-table-head', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-table-head></sc-table-head>');

    const element = await page.find('sc-table-head');
    expect(element).toHaveClass('hydrated');
  });
});
