import { newE2EPage } from '@stencil/core/testing';

describe('sc-skeleton', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-skeleton></sc-skeleton>');

    const element = await page.find('sc-skeleton');
    expect(element).toHaveClass('hydrated');
  });
});
