import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-shipping-address', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address></sc-order-shipping-address>');

    const element = await page.find('sc-order-shipping-address');
    expect(element).toHaveClass('hydrated');
  });

  it('uses customer shipping address if supplied', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address></sc-order-shipping-address>');
    page.waitForChanges();

    // default.
    let element = await page.find('sc-order-shipping-address >>> sc-compact-address');
    let address = await element.getProperty('address');
    expect(address).toEqual({ country: null, city: null, line_1: null, line_2: null, postal_code: null, state: null });

    // customer shipping address
    await page.$eval('sc-order-shipping-address', (elm: any) => {
      elm.shippingAddress = { id: 'test', country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' };
    });

    await page.waitForChanges();
    address = await element.getProperty('address');
    expect(address).toEqual({ id: 'test', country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' });
  });

  it('renders custom placeholders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address name-placeholder="name test" country-placeholder="country test" city-placeholder="city test" line-1-placeholder="line 1 test" line-2-placeholder="line 2 test" postal-code-placeholder="postal code test" state-placeholder="state test" full></sc-order-shipping-address>');
    await page.waitForChanges();

    let element = await page.find('sc-order-shipping-address >>> sc-address');
    let placeholders = await element.getProperty('placeholders');
    expect(placeholders).toEqual({
      name: 'name test',
      country: 'country test' ,
      city: "city test",
      line_1: "line 1 test",
      line_2: "line 2 test",
      postal_code: "postal code test",
      state: "state test"
    });
  });
});
