import { newE2EPage } from '@stencil/core/testing';

describe('ce-quantity-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-quantity-select></ce-quantity-select>');

    const element = await page.find('ce-quantity-select');
    expect(element).toHaveClass('hydrated');
  });
});
