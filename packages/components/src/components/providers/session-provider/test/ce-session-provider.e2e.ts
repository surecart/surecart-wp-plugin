import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';

describe('ce-session-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/checkout-engine/v1/orders',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<ce-session-provider></ce-session-provider>');
    const element = await page.find('ce-session-provider');
    expect(element).toHaveClass('hydrated');
  });
});
