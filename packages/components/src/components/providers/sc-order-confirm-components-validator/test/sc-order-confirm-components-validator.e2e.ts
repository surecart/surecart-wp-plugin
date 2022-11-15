import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-confirm-components-validator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-confirm-components-validator></sc-order-confirm-components-validator>');

    const element = await page.find('sc-order-confirm-components-validator');
    expect(element).toHaveClass('hydrated');
  });
});
