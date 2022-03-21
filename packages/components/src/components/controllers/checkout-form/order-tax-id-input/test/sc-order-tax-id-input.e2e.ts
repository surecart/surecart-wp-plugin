import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-tax-id-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-tax-id-input></sc-order-tax-id-input>');

    const element = await page.find('sc-order-tax-id-input');
    expect(element).toHaveClass('hydrated');
  });
});
