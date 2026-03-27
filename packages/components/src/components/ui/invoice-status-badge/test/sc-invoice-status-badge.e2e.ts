import { newE2EPage } from '@stencil/core/testing';

describe('sc-invoice-status-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-invoice-status-badge></sc-invoice-status-badge>');

    const element = await page.find('sc-invoice-status-badge');
    expect(element).toHaveClass('hydrated');
  });
});
