import { newE2EPage } from '@stencil/core/testing';

describe('sc-password-nag', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-password-nag></sc-password-nag>');

    const element = await page.find('sc-password-nag');
    expect(element).toHaveClass('hydrated');
  });
});
