import { newE2EPage } from '@stencil/core/testing';

describe('sc-secure-notice', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-secure-notice></sc-secure-notice>');

    const element = await page.find('sc-secure-notice');
    expect(element).toHaveClass('hydrated');
  });
});
