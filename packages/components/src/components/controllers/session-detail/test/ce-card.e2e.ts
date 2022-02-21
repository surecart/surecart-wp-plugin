import { newE2EPage } from '@stencil/core/testing';

describe('ce-session-detail', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-session-detail></ce-session-detail>');

    const element = await page.find('ce-session-detail');
    expect(element).toHaveClass('hydrated');
  });
});
