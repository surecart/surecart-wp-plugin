import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-summary', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-summary></sc-order-summary>');

    const element = await page.find('sc-order-summary');
    expect(element).toHaveClass('hydrated');
  });
});
