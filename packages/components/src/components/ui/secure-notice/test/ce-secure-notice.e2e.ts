import { newE2EPage } from '@stencil/core/testing';

describe('ce-secure-notice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-secure-notice></ce-secure-notice>');

    const element = await page.find('ce-secure-notice');
    expect(element).toHaveClass('hydrated');
  });
});
