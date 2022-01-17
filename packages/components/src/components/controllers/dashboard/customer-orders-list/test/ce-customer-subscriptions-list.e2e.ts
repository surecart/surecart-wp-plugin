import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-subscriptions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-subscriptions-list></ce-customer-subscriptions-list>');

    const element = await page.find('ce-customer-subscriptions-list');
    expect(element).toHaveClass('hydrated');
  });
});
