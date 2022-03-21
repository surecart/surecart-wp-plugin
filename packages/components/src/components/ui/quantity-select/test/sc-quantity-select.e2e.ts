import { newE2EPage } from '@stencil/core/testing';

describe('sc-quantity-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-quantity-select></sc-quantity-select>');

    const element = await page.find('sc-quantity-select');
    expect(element).toHaveClass('hydrated');
  });
});
