import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-confirmation-summary', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-confirmation-summary></ce-order-confirmation-summary>');

    const element = await page.find('ce-order-confirmation-summary');
    expect(element).toHaveClass('hydrated');
  });
});
