import { newE2EPage } from '@stencil/core/testing';

describe('ce-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-icon></ce-icon>');

    const element = await page.find('ce-icon');
    expect(element).toHaveClass('hydrated');
  });
});
