import { newSpecPage } from '@stencil/core/testing';
import { ScOrderCouponForm } from '../sc-order-coupon-form';

describe('sc-order-coupon-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderCouponForm],
      html: `<sc-order-coupon-form></sc-order-coupon-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
