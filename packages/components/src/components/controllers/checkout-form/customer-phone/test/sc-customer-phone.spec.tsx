import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { Checkout, Customer } from '../../../../../types';
import { ScCustomerPhone } from '../sc-customer-phone';

describe('sc-customer-phone', () => {
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
      template: () => <sc-customer-phone customer={{ phone: '999' } as Customer}></sc-customer-phone>,
    });
    expect(page.root).toMatchSnapshot();
  })

  it('Uses the customer phone number if set', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone></sc-customer-phone>,
    });
    page.root.customer = { phone: '999' };
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  })

  it('Uses the checkout phone number on load', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone checkout={{ phone: '111' } as Checkout}></sc-customer-phone>,
    });
    expect(page.root).toMatchSnapshot();
  })

  it('Uses the checkout phone number if set ', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone></sc-customer-phone>,
    });
    page.root.checkout = { phone: '111' };
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  })

  it('Uses checkout as a preference if both customer and checkout load a phone number.', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone checkout={{ phone: '111' } as Checkout} customer={{ phone: '999' } as Customer}></sc-customer-phone>,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  })

  it('Uses checkout as a preference if both customer and checkout set a phone number.', async () => {
    const page = await newSpecPage({
      components: [ScCustomerPhone],
      template: () => <sc-customer-phone></sc-customer-phone>,
    });
    page.root.checkout = { phone: '111'};
    page.root.customer = { phone: '999' };
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  })
});
