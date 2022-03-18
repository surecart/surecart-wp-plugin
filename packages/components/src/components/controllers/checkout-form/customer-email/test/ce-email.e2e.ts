import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-email', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-email></ce-customer-email>');

    const element = await page.find('ce-customer-email');
    expect(element).toHaveClass('hydrated');
  });
});
