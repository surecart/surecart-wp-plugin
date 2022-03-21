import { newE2EPage } from '@stencil/core/testing';

describe('sc-payment-method-create', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-payment-method-create></sc-payment-method-create>');

    const element = await page.find('sc-payment-method-create');
    expect(element).toHaveClass('hydrated');
  });
});
