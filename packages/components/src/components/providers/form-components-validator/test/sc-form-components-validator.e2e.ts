import { newE2EPage } from '@stencil/core/testing';
import {state as checkoutState} from '@store/checkout'
import { Checkout } from 'src/types';

describe('sc-form-components-validator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-form-components-validator></sc-form-components-validator>');

    const element = await page.find('sc-form-components-validator');
    expect(element).toHaveClass('hydrated');
  });

  it('Should require address, show name and require name when shipping address is required', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-form-components-validator></sc-form-components-validator>');
      checkoutState.checkout = {
      id: 'test',
      shipping_address_required: true,
    } as Checkout;
    await page.waitForChanges()

    let element = await page.find('sc-form-components-validator >> sc-order-shipping-address >> sc-address');
    let required = await element.getProperty('required');
    let requireName = await element.getProperty('requireName');
    let showName = await element.getProperty('showName');

    expect(required).toEqual(true);
    expect(requireName).toEqual(true);
    expect(showName).toEqual(true);
  });

  it('Should make the name required in sc-customer-name if it is present and shipping address is required',async()=>{
    const page = await newE2EPage();
    await page.setContent('<sc-form-components-validator><sc-customer-name></sc-customer-name></sc-form-components-validator>');
    checkoutState.checkout = {
      id: 'test',
      shipping_address_required: true,
    } as Checkout;
    await page.waitForChanges()

    let scCustomer = await page.find('sc-form-components-validator >> sc-customer-name');
    let requiredCustomerName = await scCustomer.getProperty('required');

    let address = await page.find('sc-form-components-validator >> sc-order-shipping-address >> sc-address');
    let requireName = await address.getProperty('requireName');

    expect(requireName).toEqual(false);
    expect(requiredCustomerName).toEqual(true);
  })
});
