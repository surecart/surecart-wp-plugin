import { newE2EPage } from '@stencil/core/testing';

describe('ce-payment-method-create', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-payment-method-create></ce-payment-method-create>');

    const element = await page.find('ce-payment-method-create');
    expect(element).toHaveClass('hydrated');
  });
});
