import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirmation-totals', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirmation-totals></sc-order-confirmation-totals>');

    const element = await page.find('sc-order-confirmation-totals');
    expect(element).toHaveClass('hydrated');
  });
});
