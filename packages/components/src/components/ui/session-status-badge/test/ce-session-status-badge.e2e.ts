import { newE2EPage } from '@stencil/core/testing';

describe('ce-session-status-badge', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-session-status-badge></ce-session-status-badge>');

    const element = await page.find('ce-session-status-badge');
    expect(element).toHaveClass('hydrated');
  });
});
