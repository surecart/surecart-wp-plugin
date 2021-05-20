import { newE2EPage } from '@stencil/core/testing';

describe('presto-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-divider></presto-divider>');

    const element = await page.find('presto-divider');
    expect(element).toHaveClass('hydrated');
  });
});
