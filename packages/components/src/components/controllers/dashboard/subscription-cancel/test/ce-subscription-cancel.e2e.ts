import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../../testing';

describe('ce-subscription-cancel', () => {
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
    await page.setContent('<ce-subscription-cancel></ce-subscription-cancel>');

    const element = await page.find('ce-subscription-cancel');
    expect(element).toHaveClass('hydrated');
  });
});
