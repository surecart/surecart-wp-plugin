import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../../testing';

describe('sc-customer-details', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/surecart/v1/customers',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<sc-customer-details></sc-customer-details>');

    const element = await page.find('sc-customer-details');
    expect(element).toHaveClass('hydrated');
  });
});
