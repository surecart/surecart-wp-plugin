import { newE2EPage } from '@stencil/core/testing';

describe('ce-session-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-session-provider></ce-session-provider>');
    const element = await page.find('ce-session-provider');
    expect(element).toHaveClass('hydrated');
  });
});
