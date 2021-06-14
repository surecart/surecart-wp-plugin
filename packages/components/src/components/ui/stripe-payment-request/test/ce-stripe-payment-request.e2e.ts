import { newE2EPage } from '@stencil/core/testing';

describe('ce-stripe-payment-request', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<ce-stripe-payment-request publishable-key="pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845"></ce-stripe-payment-request>',
    );

    const element = await page.find('ce-stripe-payment-request');
    expect(element).toHaveClass('hydrated');
  });
});
