import { newE2EPage } from '@stencil/core/testing';

describe('sc-customer-phone', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-customer-phone></sc-customer-phone>');

    const element = await page.find('sc-customer-phone');
    expect(element).toHaveClass('hydrated');
  });
});
