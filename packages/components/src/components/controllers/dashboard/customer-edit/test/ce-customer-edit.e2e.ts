import { newE2EPage } from '@stencil/core/testing';

describe('ce-customer-edit', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-customer-edit></ce-customer-edit>');

    const element = await page.find('ce-customer-edit');
    expect(element).toHaveClass('hydrated');
  });
});
