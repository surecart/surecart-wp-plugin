import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../../testing';

describe('sc-subscription-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/surecart/v1/payment_methods',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<sc-subscription-payment></sc-subscription-payment>');

    const element = await page.find('sc-subscription-payment');
    expect(element).toHaveClass('hydrated');
  });
});
