import { newE2EPage } from '@stencil/core/testing';

describe('sc-donation-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-donation-choices></sc-donation-choices>');

    const element = await page.find('sc-donation-choices');
    expect(element).toHaveClass('hydrated');
  });
});
