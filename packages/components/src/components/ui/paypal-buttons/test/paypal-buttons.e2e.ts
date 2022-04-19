import { newE2EPage } from '@stencil/core/testing';

describe('paypal-buttons', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<paypal-buttons></paypal-buttons>');

    const element = await page.find('paypal-buttons');
    expect(element).toHaveClass('hydrated');
  });
});
