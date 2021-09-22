import { newE2EPage } from '@stencil/core/testing';

describe('ce-select-dropdown', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-select-dropdown></ce-select-dropdown>');

    const element = await page.find('ce-select-dropdown');
    expect(element).toHaveClass('hydrated');
  });
});
