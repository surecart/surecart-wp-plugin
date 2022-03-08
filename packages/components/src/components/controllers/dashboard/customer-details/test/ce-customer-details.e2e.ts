import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-details', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-details></ce-customer-details>');

    const element = await page.find('ce-customer-details');
    expect(element).toHaveClass('hydrated');
  });
});
