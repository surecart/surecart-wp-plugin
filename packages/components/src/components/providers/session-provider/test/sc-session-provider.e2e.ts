import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';

describe('sc-session-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    setResponses(
      [
        {
          path: '/surecart/v1/checkouts',
          data: {},
        },
      ],
      page,
    );
    await page.setContent('<sc-session-provider></sc-session-provider>');
    const element = await page.find('sc-session-provider');
    expect(element).toHaveClass('hydrated');
  });
});
