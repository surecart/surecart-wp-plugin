import { newE2EPage } from '@stencil/core/testing';

describe('sc-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-icon></sc-icon>');

    const element = await page.find('sc-icon');
    expect(element).toHaveClass('hydrated');
  });
});
