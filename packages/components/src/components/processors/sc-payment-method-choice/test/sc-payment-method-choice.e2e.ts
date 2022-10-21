import { newE2EPage } from '@stencil/core/testing';

describe('sc-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-payment-method-choice></sc-payment-method-choice>');

    const element = await page.find('sc-payment-method-choice');
    expect(element).toHaveClass('hydrated');
  });
});
