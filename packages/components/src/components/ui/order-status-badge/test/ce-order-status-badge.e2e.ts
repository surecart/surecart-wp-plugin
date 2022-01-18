import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-status-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-status-badge></ce-order-status-badge>');

    const element = await page.find('ce-order-status-badge');
    expect(element).toHaveClass('hydrated');
  });
});
