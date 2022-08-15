import { newE2EPage } from '@stencil/core/testing';

describe('checkout-unsaved-changes-warning', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-checkout-unsaved-changes-warning></sc-checkout-unsaved-changes-warning>');

    const element = await page.find('sc-checkout-unsaved-changes-warning');
    expect(element).toHaveClass('hydrated');
  });
});
