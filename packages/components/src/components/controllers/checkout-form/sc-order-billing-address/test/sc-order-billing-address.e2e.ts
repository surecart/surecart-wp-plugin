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
    page.waitForChanges();

    const addressField = await page.find('sc-order-billing-address >>> .order-billing-address__toggle');
    const checkBox = await page.find('sc-order-billing-address >>> sc-checkbox');

    // address field is not visible & switch is visible and checked
    expect(addressField).toBeNull();
    expect(checkBox).not.toBeNull();
    expect(await checkBox.getProperty('checked')).toBeTruthy();

    // toggle checkbox
    checkBox.setAttribute('checked', false);
    await page.waitForChanges();

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

  it('renders custom placeholders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<sc-order-billing-address name-placeholder="name test" country-placeholder="country test" city-placeholder="city test" line-1-placeholder="line 1 test" line-2-placeholder="line 2 test" postal-code-placeholder="postal code test" state-placeholder="state test" full></sc-order-billing-address>',
    );
    await page.waitForChanges();

    const element = await page.find('sc-order-billing-address >>> sc-address');
    const placeholders = await element.getProperty('placeholders');
    expect(placeholders).toEqual({
      name: 'name test',
      country: 'country test',
      city: 'city test',
      line_1: 'line 1 test',
      line_2: 'line 2 test',
      postal_code: 'postal code test',
      state: 'state test',
    });
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
