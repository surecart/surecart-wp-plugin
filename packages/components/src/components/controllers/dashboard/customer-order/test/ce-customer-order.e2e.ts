import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-orders', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-orders></ce-customer-orders>');

    const element = await page.find('ce-customer-orders');
    expect(element).toHaveClass('hydrated');
  });
});
