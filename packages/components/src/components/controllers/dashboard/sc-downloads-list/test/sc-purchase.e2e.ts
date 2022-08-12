import { newE2EPage } from '@stencil/core/testing';

describe('sc-purchase', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-purchase></sc-purchase>');

    const element = await page.find('sc-purchase');
    expect(element).toHaveClass('hydrated');
  });
});
