import { newE2EPage } from '@stencil/core/testing';

describe('sc-tag', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-tag></sc-tag>');

    const element = await page.find('sc-tag');
    expect(element).toHaveClass('hydrated');
  });
});
