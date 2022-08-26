import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../../testing';

describe('sc-dashboard-customer-details', () => {
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
    await page.setContent('<sc-dashboard-customer-details></sc-dashboard-customer-details>');

    const element = await page.find('sc-dashboard-customer-details');
    expect(element).toHaveClass('hydrated');
  });
});
