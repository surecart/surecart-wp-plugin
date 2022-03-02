import { newE2EPage } from '@stencil/core/testing';

describe('payment-method-create', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<payment-method-create></payment-method-create>');

    const element = await page.find('payment-method-create');
    expect(element).toHaveClass('hydrated');
  });
});
