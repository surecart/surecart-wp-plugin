import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-orders-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-orders-list></ce-customer-orders-list>');

    const element = await page.find('ce-customer-orders-list');
    expect(element).toHaveClass('hydrated');
  });
});
