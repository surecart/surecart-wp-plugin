import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-subscription-edit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-subscription-edit></ce-customer-subscription-edit>');

    const element = await page.find('ce-customer-subscription-edit');
    expect(element).toHaveClass('hydrated');
  });
});
