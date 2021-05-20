import { newE2EPage } from '@stencil/core/testing';

describe('presto-order-summary', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-order-summary></presto-order-summary>');

    const element = await page.find('presto-order-summary');
    expect(element).toHaveClass('hydrated');
  });
});
