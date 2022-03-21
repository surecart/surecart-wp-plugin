import { newE2EPage } from '@stencil/core/testing';

describe('sc-columns', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-columns></sc-columns>');

    const element = await page.find('sc-columns');
    expect(element).toHaveClass('hydrated');
  });
});
