import { newE2EPage } from '@stencil/core/testing';

describe('sc-line-items-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-line-items-provider></sc-line-items-provider>');

    const element = await page.find('sc-line-items-provider');
    expect(element).toHaveClass('hydrated');
  });
});
