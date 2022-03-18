import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-summary', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-summary></ce-order-summary>');

    const element = await page.find('ce-order-summary');
    expect(element).toHaveClass('hydrated');
  });
});
