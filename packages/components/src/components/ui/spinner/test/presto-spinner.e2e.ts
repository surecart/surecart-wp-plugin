import { newE2EPage } from '@stencil/core/testing';

describe('presto-spinner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-spinner></presto-spinner>');

    const element = await page.find('presto-spinner');
    expect(element).toHaveClass('hydrated');
  });
});
