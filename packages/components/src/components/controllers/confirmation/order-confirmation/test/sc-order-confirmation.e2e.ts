import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirmation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirmation></sc-order-confirmation>');

    const element = await page.find('sc-order-confirmation');
    expect(element).toHaveClass('hydrated');
  });
});
