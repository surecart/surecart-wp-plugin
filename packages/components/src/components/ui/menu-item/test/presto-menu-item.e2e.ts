import { newE2EPage } from '@stencil/core/testing';

describe('presto-menu-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-menu-item></presto-menu-item>');

    const element = await page.find('presto-menu-item');
    expect(element).toHaveClass('hydrated');
  });
});
