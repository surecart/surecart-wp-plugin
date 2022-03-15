import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CeCouponForm } from '../ce-coupon-form';

describe('ce-coupon-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCouponForm],
      html: `<ce-coupon-form></ce-coupon-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('handles applied coupons', async () => {
    const page = await newSpecPage({
      components: [CeCouponForm],
      template: () => (
        <ce-coupon-form
          discount={{
            coupon: {
              percent_off: 25.0,
              currency: 'usd',
            },
            promotion: {
              code: 'TESTCODE',
            },
          }}
          discountAmount={725}
          currency={'usd'}
        ></ce-coupon-form>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
});
