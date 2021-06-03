import { newE2EPage } from '@stencil/core/testing';

describe('ce-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-select></ce-select>');

    const element = await page.find('ce-select');
    expect(element).toHaveClass('hydrated');
  });
});
