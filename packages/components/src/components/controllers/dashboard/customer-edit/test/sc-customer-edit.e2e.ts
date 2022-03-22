import { newE2EPage } from '@stencil/core/testing';

describe('sc-customer-edit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-customer-edit></sc-customer-edit>');

    const element = await page.find('sc-customer-edit');
    expect(element).toHaveClass('hydrated');
  });
});
