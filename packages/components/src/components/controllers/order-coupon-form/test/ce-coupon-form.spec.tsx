import { newSpecPage } from '@stencil/core/testing';
import { CeCouponForm } from '../ce-order-coupon-form';

describe('ce-coupon-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCouponForm],
      html: `<ce-coupon-form></ce-coupon-form>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
