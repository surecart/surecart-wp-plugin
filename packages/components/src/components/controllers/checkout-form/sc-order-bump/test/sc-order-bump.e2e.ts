import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-bump', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-bump></sc-order-bump>');

    const element = await page.find('sc-order-bump');
    expect(element).toHaveClass('hydrated');
  });
});
