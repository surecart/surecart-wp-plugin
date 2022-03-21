import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-items', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-items></sc-line-items>');

    const element = await page.find('sc-line-items');
    expect(element).toHaveClass('hydrated');
  });
});
