import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-tax-id-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-tax-id-input></ce-order-tax-id-input>');

    const element = await page.find('ce-order-tax-id-input');
    expect(element).toHaveClass('hydrated');
  });
});
