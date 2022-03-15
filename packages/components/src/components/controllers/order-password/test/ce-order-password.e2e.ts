import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-password', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-password></ce-order-password>');

    const element = await page.find('ce-order-password');
    expect(element).toHaveClass('hydrated');
  });
});
