import { newE2EPage } from '@stencil/core/testing';

describe('ce-columns', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-columns></ce-columns>');

    const element = await page.find('ce-columns');
    expect(element).toHaveClass('hydrated');
  });
});
