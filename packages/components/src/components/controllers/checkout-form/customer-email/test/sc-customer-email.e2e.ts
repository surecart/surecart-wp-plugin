import { newE2EPage } from '@stencil/core/testing';

describe('sc-customer-email', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-customer-email></sc-customer-email>');

    const element = await page.find('sc-customer-email');
    expect(element).toHaveClass('hydrated');
  });
});
