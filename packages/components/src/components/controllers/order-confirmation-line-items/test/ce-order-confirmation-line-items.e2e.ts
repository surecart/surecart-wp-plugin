import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-confirmation-line-items', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-confirmation-line-items></ce-order-confirmation-line-items>');

    const element = await page.find('ce-order-confirmation-line-items');
    expect(element).toHaveClass('hydrated');
  });
});
