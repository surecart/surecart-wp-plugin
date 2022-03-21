import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../../testing';

describe('sc-subscription-cancel', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/surecart/v1/subscription_protocol',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<sc-subscription-cancel></sc-subscription-cancel>');

    const element = await page.find('sc-subscription-cancel');
    expect(element).toHaveClass('hydrated');
  });
});
