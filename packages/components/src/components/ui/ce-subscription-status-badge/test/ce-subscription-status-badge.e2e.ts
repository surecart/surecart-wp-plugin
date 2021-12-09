import { newE2EPage } from '@stencil/core/testing';

describe('ce-subscription-status-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-subscription-status-badge></ce-subscription-status-badge>');

    const element = await page.find('ce-subscription-status-badge');
    expect(element).toHaveClass('hydrated');
  });
});
