import { newE2EPage } from '@stencil/core/testing';
import { dispose as disposeCheckout } from '@store/checkout';

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

  it('uses default country if supplied', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-shipping-address default-country="BD"></sc-order-shipping-address>');
    await page.waitForChanges();

    let address = await page.find('sc-order-shipping-address >>> sc-compact-address');
    let addressProp = await address.getProperty('address');
    expect(addressProp.country).toEqual('BD');
  });
});
