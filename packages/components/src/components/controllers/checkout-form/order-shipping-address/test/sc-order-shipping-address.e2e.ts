import { newE2EPage } from '@stencil/core/testing';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { Checkout } from 'src/types';

describe('sc-order-shipping-address', () => {
  beforeEach(() => {
    disposeCheckout();
  });
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address></sc-order-shipping-address>');

    const element = await page.find('sc-order-shipping-address');
    expect(element).toHaveClass('hydrated');
  });

  it('renders custom placeholders', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<sc-order-shipping-address name-placeholder="name test" country-placeholder="country test" city-placeholder="city test" line-1-placeholder="line 1 test" line-2-placeholder="line 2 test" postal-code-placeholder="postal code test" state-placeholder="state test" full></sc-order-shipping-address>',
    );
    await page.waitForChanges();

    let element = await page.find('sc-order-shipping-address >>> sc-address');
    let placeholders = await element.getProperty('placeholders');
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
    await page.setContent('<sc-order-shipping-address default-country="BD"></sc-order-shipping-address>');
    await page.waitForChanges();

    let address = await page.find('sc-order-shipping-address >>> sc-compact-address');
    let addressProp = await address.getProperty('address');
    expect(addressProp.country).toEqual('BD');
  });
});
