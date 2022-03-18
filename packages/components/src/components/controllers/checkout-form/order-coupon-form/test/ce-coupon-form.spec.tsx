import { newSpecPage } from '@stencil/core/testing';
import { CeOrderCouponForm } from '../ce-order-coupon-form';

describe('ce-order-coupon-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderCouponForm],
      html: `<ce-order-coupon-form></ce-order-coupon-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
