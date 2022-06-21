import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirm-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirm-provider></sc-order-confirm-provider>');

    const element = await page.find('sc-order-confirm-provider');
    expect(element).toHaveClass('hydrated');
  });
});
