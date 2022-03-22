import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-password', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-password></sc-order-password>');

    const element = await page.find('sc-order-password');
    expect(element).toHaveClass('hydrated');
  });
});
