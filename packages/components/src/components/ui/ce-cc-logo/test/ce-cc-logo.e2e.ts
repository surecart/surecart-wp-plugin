import { newE2EPage } from '@stencil/core/testing';

describe('ce-cc-logo', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-cc-logo></ce-cc-logo>');

    const element = await page.find('ce-cc-logo');
    expect(element).toHaveClass('hydrated');
  });
});
