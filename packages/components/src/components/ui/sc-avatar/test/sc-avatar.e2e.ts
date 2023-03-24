import { newE2EPage } from '@stencil/core/testing';

describe('sc-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-avatar></sc-avatar>');

    const element = await page.find('sc-avatar');
    expect(element).toHaveClass('hydrated');
  });
});
