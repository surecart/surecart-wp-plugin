import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-billing-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-billing-address></sc-order-billing-address>');

    const element = await page.find('sc-order-billing-address');
    expect(element).toHaveClass('hydrated');
  });

  it('Should show billing address input when checkbox is unchecked', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address></sc-order-shipping-address><sc-order-billing-address></sc-order-billing-address>');
    await page.waitForChanges();

    let addressField = await page.find('sc-order-billing-address >>> sc-address');
    const checkBox = await page.find('sc-order-billing-address >>> sc-checkbox');

    // toggle checkbox
    checkBox.setAttribute('checked', false);
    await page.waitForChanges();
    addressField = await page.find('sc-order-billing-address >>> sc-address');

    // address field is visible & switch is visible and not checked
    expect(addressField).not.toBeNull();
    expect(checkBox).not.toBeNull();
    expect(await checkBox.getProperty('checked')).toBeFalsy();
  });

  it('should show billing address if shipping address field does not exist', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-billing-address></sc-order-billing-address>');
    page.waitForChanges();

    const addressField = await page.find('sc-order-billing-address >>> sc-address');
    const switchField = await page.find('sc-order-billing-address >>> sc-switch');

    // address field is visible & switch is not visible
    expect(addressField).not.toBeNull();
    expect(switchField).toBeNull();
  });

  it('uses default country if supplied', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-billing-address default-country="BD"></sc-order-billing-address>');
    await page.waitForChanges();

    const address = await page.find('sc-order-billing-address >>> sc-address');
    const addressProp = await address.getProperty('address');
    expect(addressProp.country).toEqual('BD');
  });
});
