import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-status-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-status-badge></sc-order-status-badge>');

    const element = await page.find('sc-order-status-badge');
    expect(element).toHaveClass('hydrated');
  });
});
