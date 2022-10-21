import { newE2EPage } from '@stencil/core/testing';

describe('sc-stripe-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-stripe-payment-method-choice></sc-stripe-payment-method-choice>');

    const element = await page.find('sc-stripe-payment-method-choice');
    expect(element).toHaveClass('hydrated');
  });
});
