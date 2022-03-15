import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';

describe('ce-checkout', () => {
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
    await page.setContent('<ce-checkout></ce-checkout>');
    const element = await page.find('ce-checkout');
    expect(element).toHaveClass('hydrated');
  });
});
