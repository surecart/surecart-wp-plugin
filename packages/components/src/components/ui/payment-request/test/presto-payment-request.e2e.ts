import { newE2EPage } from '@stencil/core/testing';

describe('presto-stripe-payment-request', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<presto-stripe-payment-request publishable-key="pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845"></presto-stripe-payment-request>',
    );

    const element = await page.find('presto-stripe-payment-request');
    expect(element).toHaveClass('hydrated');
  });
});
