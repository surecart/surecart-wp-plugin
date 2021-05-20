import { newE2EPage } from '@stencil/core/testing';

describe('presto-stripe-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<presto-stripe-element publishable-key="pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845"></presto-stripe-element>',
    );

    const element = await page.find('presto-stripe-element');
    expect(element).toHaveClass('hydrated');
  });
});
