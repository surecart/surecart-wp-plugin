import { newE2EPage } from '@stencil/core/testing';

describe('sc-paypal-buttons', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-paypal-buttons></sc-paypal-buttons>');

    const element = await page.find('sc-paypal-buttons');
    expect(element).toHaveClass('hydrated');
  });
});
