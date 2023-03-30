import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { state as checkoutStore, dispose } from '@store/checkout';

import { Checkout, Customer } from '../../../../../types';
import { ScCustomerPhone } from '../sc-customer-phone';

describe('sc-customer-phone', () => {
  beforeEach(() => {
    dispose();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      html: `<sc-customer-phone></sc-customer-phone>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Uses the customer phone number on load', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone></sc-customer-phone>,
    });
    checkoutStore.checkout = { customer: { phone: '999' } as Customer } as Checkout;
    expect(page.root).toMatchSnapshot();
  });

  it('Uses the checkout phone number on load', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone></sc-customer-phone>,
    });
    checkoutStore.checkout = { phone: '111' } as Checkout;
    expect(page.root).toMatchSnapshot();
  });

  it('Uses checkout as a preference if both customer and checkout load a phone number.', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone></sc-customer-phone>,
    });
    checkoutStore.checkout = { phone: '111', customer: { phone: '999' } } as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
