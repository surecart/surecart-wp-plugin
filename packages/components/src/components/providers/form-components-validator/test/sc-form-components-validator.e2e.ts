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

    let element = await page.find('sc-form-components-validator');
    let required = await element.getProperty('required');
    let requireName = await element.getProperty('requireName');
    let showName = await element.getProperty('showName');

    expect(required).toEqual(true);
    expect(requireName).toEqual(true);
    expect(showName).toEqual(true);
  });
});
