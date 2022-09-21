import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-item-bump', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-item-bump></sc-line-item-bump>');

    const element = await page.find('sc-line-item-bump');
    expect(element).toHaveClass('hydrated');
  });
});
