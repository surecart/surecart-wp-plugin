import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-subscriptions', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-subscriptions></ce-customer-subscriptions>');

    const element = await page.find('ce-customer-subscriptions');
    expect(element).toHaveClass('hydrated');
  });
});
