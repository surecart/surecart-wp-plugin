import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-dashboard', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-dashboard></ce-customer-dashboard>');

    const element = await page.find('ce-customer-dashboard');
    expect(element).toHaveClass('hydrated');
  });
});
