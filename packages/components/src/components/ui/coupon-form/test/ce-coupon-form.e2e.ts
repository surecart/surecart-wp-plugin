import { newE2EPage } from '@stencil/core/testing';

describe('ce-coupon-form', () => {
  let page, element, trigger, input, wrapper, button;

  const selector = 'ce-coupon-form';

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`<${selector} label="Add A Coupon"></${selector}>`);
    wrapper = await page.find(`${selector} >>> .coupon-form`);
    element = await page.find(`${selector}`);
    trigger = await page.find(`${selector} >>> .trigger`);
    input = await page.find(`${selector} >>> ce-input >>> .input__control`);
    button = await page.find(`${selector} >>> ce-button`);
  });

  it('renders', async () => {
    expect(element).toHaveClass('hydrated');
  });

  it('Has a loading state', async () => {
    element.setProperty('loading', true);
    await page.waitForChanges();
    const loading = await page.find(`${selector} >>> ce-skeleton`);
    expect(loading).not.toBeNull();
  });

  it('Can toggle coupon field', async () => {
    expect(wrapper).not.toHaveClass('coupon-form--is-open');
    expect(trigger).toBeDefined();
    await trigger.click();
    await page.waitForChanges();
    expect(wrapper).toHaveClass('coupon-form--is-open');
  });

  it('Triggers a coupon apply event', async () => {
    const ceApplyCoupon = await page.spyOnEvent('ceApplyCoupon');

    await trigger.click();
    await page.waitForChanges();
    await input.type('TESTCOUPON');
    await button.click();
    await page.waitForChanges();
    expect(ceApplyCoupon).toHaveReceivedEventDetail('TESTCOUPON');
  });
});
