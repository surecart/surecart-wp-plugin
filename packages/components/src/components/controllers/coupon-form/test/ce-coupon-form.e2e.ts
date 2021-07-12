import { newE2EPage } from '@stencil/core/testing';

describe('ce-coupon-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-coupon-form></ce-coupon-form>');

    const element = await page.find('ce-coupon-form');
    expect(element).toHaveClass('hydrated');
  });
});
