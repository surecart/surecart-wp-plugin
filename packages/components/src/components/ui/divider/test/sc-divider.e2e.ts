import { newE2EPage } from '@stencil/core/testing';

describe('sc-divider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-divider></sc-divider>');

    const element = await page.find('sc-divider');
    expect(element).toHaveClass('hydrated');
  });
});
