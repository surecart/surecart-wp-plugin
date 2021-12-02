import { newE2EPage } from '@stencil/core/testing';

describe('ce-text', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-text></ce-text>');

    const element = await page.find('ce-text');
    expect(element).toHaveClass('hydrated');
  });
});
