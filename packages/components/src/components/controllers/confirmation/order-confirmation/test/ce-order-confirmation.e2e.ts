import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-confirmation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-confirmation></ce-order-confirmation>');

    const element = await page.find('ce-order-confirmation');
    expect(element).toHaveClass('hydrated');
  });
});
