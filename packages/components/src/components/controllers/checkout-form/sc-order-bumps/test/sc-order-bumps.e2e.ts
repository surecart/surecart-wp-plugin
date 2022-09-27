import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-bumps', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-bumps></sc-order-bumps>');

    const element = await page.find('sc-order-bumps');
    expect(element).toHaveClass('hydrated');
  });
});
