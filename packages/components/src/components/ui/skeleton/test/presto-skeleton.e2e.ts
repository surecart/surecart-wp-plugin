import { newE2EPage } from '@stencil/core/testing';

describe('presto-skeleton', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-skeleton></presto-skeleton>');

    const element = await page.find('presto-skeleton');
    expect(element).toHaveClass('hydrated');
  });
});
