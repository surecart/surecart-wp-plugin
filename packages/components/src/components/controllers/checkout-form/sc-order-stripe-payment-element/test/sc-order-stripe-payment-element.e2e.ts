import { newE2EPage } from '@stencil/core/testing';

import { setResponses } from '../../../../../testing';

describe('sc-order-stripe-payment-element', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/surecart/v1/payment_intents',
          data: {},
        },
      ],
      page,
    );

    await page.setContent('<sc-order-stripe-payment-element></sc-order-stripe-payment-element>');

    const element = await page.find('sc-order-stripe-payment-element');
    expect(element).toHaveClass('hydrated');
  });
});
