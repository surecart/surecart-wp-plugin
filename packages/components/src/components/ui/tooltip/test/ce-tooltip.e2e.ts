import { newE2EPage } from '@stencil/core/testing';

describe('presto-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-tooltip></presto-tooltip>');

    const element = await page.find('presto-tooltip');
    expect(element).toHaveClass('hydrated');
  });
});
