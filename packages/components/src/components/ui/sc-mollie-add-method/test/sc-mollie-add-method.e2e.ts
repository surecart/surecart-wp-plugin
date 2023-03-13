import { newE2EPage } from '@stencil/core/testing';

describe('sc-mollie-add-method', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-mollie-add-method></sc-mollie-add-method>');

    const element = await page.find('sc-mollie-add-method');
    expect(element).toHaveClass('hydrated');
  });
});
