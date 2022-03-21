import { newE2EPage } from '@stencil/core/testing';

describe('sc-select', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-select></sc-select>');

    const element = await page.find('sc-select');
    expect(element).toHaveClass('hydrated');
  });
});
