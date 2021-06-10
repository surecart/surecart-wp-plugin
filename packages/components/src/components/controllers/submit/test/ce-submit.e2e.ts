import { newE2EPage } from '@stencil/core/testing';

describe('ce-submit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-submit></ce-submit>');

    const element = await page.find('ce-submit');
    expect(element).toHaveClass('hydrated');
  });
});
