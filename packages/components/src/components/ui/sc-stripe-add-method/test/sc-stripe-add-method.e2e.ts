import { newE2EPage } from '@stencil/core/testing';

describe('sc-stripe-add-method', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-stripe-add-method></sc-stripe-add-method>');

    const element = await page.find('sc-stripe-add-method');
    expect(element).toHaveClass('hydrated');
  });
});
