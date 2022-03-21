import { newE2EPage } from '@stencil/core/testing';

describe('sc-stripe-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<sc-stripe-element publishable-key="pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845"></sc-stripe-element>',
    );

    const element = await page.find('sc-stripe-element');
    expect(element).toHaveClass('hydrated');
  });
});
