import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-item></sc-line-item>');

    const element = await page.find('sc-line-item');
    expect(element).toHaveClass('hydrated');
  });
});
