import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-confirmation-totals', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-confirmation-totals></ce-order-confirmation-totals>');

    const element = await page.find('ce-order-confirmation-totals');
    expect(element).toHaveClass('hydrated');
  });
});
