import { newE2EPage } from '@stencil/core/testing';

describe('presto-checkout', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<presto-checkout></presto-checkout>');

    const element = await page.find('presto-checkout');
    expect(element).toHaveClass('hydrated');
  });
});
