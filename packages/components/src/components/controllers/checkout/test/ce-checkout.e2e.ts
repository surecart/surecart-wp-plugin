import { newE2EPage } from '@stencil/core/testing';
import { setResponses } from '../../../../testing';
import prices from '../../../../testing/fixtures/prices';
import session from '../../../../testing/fixtures/session';

describe('ce-checkout', () => {
  //   // const setRequests = async page => {
  //   //     [
  //   //       {
  //   //         path: '/price/',
  //   //         data: {
  //   //           body: JSON.stringify(prices),
  //   //         },
  //   //       },
  //   //       {
  //   //         path: '/checkout_sessions',
  //   //         data: {
  //   //           body: JSON.stringify(session),
  //   //         },
  //   //       },
  //   //     ],
  //   //     page,
  //   //   );
  //   // };

  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-checkout></ce-checkout>');
    const element = await page.find('ce-checkout');
    expect(element).toHaveClass('hydrated');
  });

  //   // it('Creates a session', async () => {
  //   //   const page = await newE2EPage();
  //   //   await setRequests(page);

  //   //   await page.setContent(`
  //   //   <ce-checkout>
  //   //     <ce-price-choices></ce-price-choices>
  //   //     <ce-order-summary>
  //   //       <ce-line-items></ce-line-items>
  //   //       <ce-line-item-total class="ce-subtotal" total="subtotal"></ce-line-item-total>
  //   //       <ce-line-item-total class="ce-line-item-total" total="total"></ce-line-item-total>
  //   //     </ce-order-summary>
  //   //   </ce-checkout>
  //   //   `);
  //   //   // has total
  //   //   const subtotal = await page.find('.ce-subtotal >>> ce-line-item >>> .item__price');
  //   //   expect(subtotal).toEqualText('$29.00');

  //   //   // has subtotal
  //   //   const total = await page.find('.ce-line-item-total >>> ce-line-item >>> .item__price');
  //   //   expect(total).toEqualText('$28.00');
  //   // });

  //   // it('Accepts coupons', async () => {
  //   //   const page = await newE2EPage();
  //   //   await setRequests(page);

  //   //   await page.setContent(`
  //   //   <ce-checkout>
  //   //     <ce-coupon-form></ce-coupon-form>
  //   //     <ce-order-summary>
  //   //       <ce-line-items></ce-line-items>
  //   //       <ce-line-item-total class="ce-subtotal" total="subtotal"></ce-line-item-total>
  //   //       <ce-line-item-total class="ce-line-item-total" total="total"></ce-line-item-total>
  //   //     </ce-order-summary>
  //   //   </ce-checkout>
  //   //   `);
  //   //   const checkout = await page.find('ce-checkout');
  //   //   const coupon = await page.find('ce-coupon-form');

  //   //   coupon.triggerEvent('ceApplyCoupon', {
  //   //     detail: 'TESTCOUPON',
  //   //   });
  //   //   checkout.triggerEvent('ceApplyCoupon', {
  //   //     detail: 'TESTCOUPON',
  //   //   });

  //   //   // const firstResponse = await page.waitForResponse(response => response.url().includes('checkout_session'));

  //   //   // console.log(firstResponse);

  //   //   // const form = await page.find('ce-coupon-form >>> .coupon-form');
  //   //   // expect(form).not.toBeNull();
  //   // });
});
