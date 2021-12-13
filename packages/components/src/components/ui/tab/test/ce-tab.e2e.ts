import { newE2EPage } from '@stencil/core/testing';

describe('ce-tab', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-tab></ce-tab>');

    const element = await page.find('ce-tab');
    expect(element).toHaveClass('hydrated');
  });
});
