import { newE2EPage } from '@stencil/core/testing';

describe('presto-line-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-line-item></presto-line-item>');

    const element = await page.find('presto-line-item');
    expect(element).toHaveClass('hydrated');
  });
});
