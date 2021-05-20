import { newE2EPage } from '@stencil/core/testing';

describe('presto-menu-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-menu-divider></presto-menu-divider>');

    const element = await page.find('presto-menu-divider');
    expect(element).toHaveClass('hydrated');
  });
});
