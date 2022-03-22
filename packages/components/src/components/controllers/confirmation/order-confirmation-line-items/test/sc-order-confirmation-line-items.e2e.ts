import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirmation-line-items', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirmation-line-items></sc-order-confirmation-line-items>');

    const element = await page.find('sc-order-confirmation-line-items');
    expect(element).toHaveClass('hydrated');
  });
});
