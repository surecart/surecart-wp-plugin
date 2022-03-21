import { newE2EPage } from '@stencil/core/testing';

describe('sc-cc-logo', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-cc-logo></sc-cc-logo>');

    const element = await page.find('sc-cc-logo');
    expect(element).toHaveClass('hydrated');
  });
});
