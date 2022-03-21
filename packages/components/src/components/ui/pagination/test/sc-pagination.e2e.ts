import { newE2EPage } from '@stencil/core/testing';

describe('sc-pagination', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-pagination></sc-pagination>');

    const element = await page.find('sc-pagination');
    expect(element).toHaveClass('hydrated');
  });
});
