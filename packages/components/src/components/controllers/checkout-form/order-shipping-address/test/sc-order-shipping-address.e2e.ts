import { newE2EPage } from '@stencil/core/testing';
import { Address } from '../../../../../types';

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
    let element = await page.find('sc-order-shipping-address sc-compact-address');
    let address = await element.getProperty('address');
    expect(address).toEqual({ country: 'US', city: null, line_1: null, line_2: null, postal_code: null, state: null });

    // customer shipping address
    await page.$eval('sc-order-shipping-address', (elm: any) => {
      elm.customerShippingAddress = { country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' };
    });

    await page.waitForChanges();
    address = await element.getProperty('address');
    expect(address).toEqual({ country: 'UK', city: 'Monona', line_1: '303 Park Ave', line_2: null, postal_code: '12345', state: 'WI' });
  });
});
