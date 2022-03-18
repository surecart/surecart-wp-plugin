import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../../testing';

describe('ce-customer-details', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/checkout-engine/v1/customers',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<ce-customer-details></ce-customer-details>');

    const element = await page.find('ce-customer-details');
    expect(element).toHaveClass('hydrated');
  });
});
