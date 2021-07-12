import { newSpecPage } from '@stencil/core/testing';
import { CeCouponForm } from '../ce-coupon-form';

describe('ce-coupon-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCouponForm],
      html: `<ce-coupon-form></ce-coupon-form>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-coupon-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-coupon-form>
    `);
  });
});
