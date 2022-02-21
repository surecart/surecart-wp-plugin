import { newE2EPage } from '@stencil/core/testing';

describe('ce-table-head', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-table-head></ce-table-head>');

    const element = await page.find('ce-table-head');
    expect(element).toHaveClass('hydrated');
  });
});
