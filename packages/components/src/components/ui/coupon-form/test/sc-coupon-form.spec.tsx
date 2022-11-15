import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Coupon, DiscountResponse, Promotion } from '../../../../types';
import { ScCouponForm } from '../sc-coupon-form';

describe('sc-coupon-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCouponForm],
      html: `<sc-coupon-form></sc-coupon-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('handles applied coupons', async () => {
    const page = await newSpecPage({
      components: [ScCouponForm],
      template: () => (
        <sc-coupon-form
          discount={{
            coupon: {
              percent_off: 25.0,
              currency: 'usd',
            } as Coupon,
            promotion: {
              code: 'TESTCODE',
            } as Promotion,
          } as DiscountResponse}
          discountAmount={725}
          currency={'usd'}
        ></sc-coupon-form>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
});
