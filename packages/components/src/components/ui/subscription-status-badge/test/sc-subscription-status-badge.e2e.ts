import { newE2EPage } from '@stencil/core/testing';

describe('sc-subscription-status-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-subscription-status-badge></sc-subscription-status-badge>');

    const element = await page.find('sc-subscription-status-badge');
    expect(element).toHaveClass('hydrated');
  });
});
