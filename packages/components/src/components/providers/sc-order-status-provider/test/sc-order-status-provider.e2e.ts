import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-status-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-status-provider></sc-order-status-provider>');

    const element = await page.find('sc-order-status-provider');
    expect(element).toHaveClass('hydrated');
  });
});
