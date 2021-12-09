import { newE2EPage } from '@stencil/core/testing';

describe('ce-session-subscription', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-session-subscription></ce-session-subscription>');

    const element = await page.find('ce-session-subscription');
    expect(element).toHaveClass('hydrated');
  });
});
