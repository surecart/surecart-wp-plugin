// Mock the checkout store.
jest.mock('@store/checkouts/store', () => ({
  __esModule: true,
  default: {
    state: { live: {}, test: {} },
    set: jest.fn(),
    get: jest.fn(),
    onChange: jest.fn(),
    on: jest.fn(),
    dispose: jest.fn(),
  },
  state: { live: {}, test: {} },
  set: jest.fn(),
  get: jest.fn(),
  onChange: jest.fn(),
  on: jest.fn(),
  dispose: jest.fn(),
}));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Checkout, TaxProtocol } from '../../../../types';
import { state as checkoutState } from '@store/checkout';
import { ScFormComponentsValidator } from '../sc-form-components-validator';
import { ScCustomerName } from '../../../controllers/checkout-form/customer-name/sc-customer-name';
import { ScOrderShippingAddress } from '../../../controllers/checkout-form/order-shipping-address/sc-order-shipping-address';

describe('sc-form-components-validator', () => {
  beforeEach(() => {
    checkoutState.checkout = null;
    checkoutState.formId = null;
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      html: `<sc-form-components-validator></sc-form-components-validator>`,
    });
    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('appends missing address field if required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    checkoutState.checkout = { tax_status: 'address_invalid' } as Checkout;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('appends missing tax id input if required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator disabled={false} taxProtocol={{ tax_enabled: true, eu_vat_required: true } as TaxProtocol}>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('appends missing trial line item if required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-order-summary>
            <sc-line-item-total total="subtotal"></sc-line-item-total>
          </sc-order-summary>
        </sc-form-components-validator>
      ),
    });
    checkoutState.checkout = { trial_amount: 10 } as Checkout;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('appends missing address field with shipping address required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('requires the customer name on sc-customer-name if present in page and shipping address required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator, ScCustomerName, ScOrderShippingAddress],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-payment></sc-payment>
          <sc-customer-name></sc-customer-name>
        </sc-form-components-validator>
      ),
    });
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    await page.waitForChanges();

    const customerName = page.root.querySelector('sc-customer-name');
    expect(customerName.required).toBe(true);

    const shippingAddress = page.root.querySelector('sc-order-shipping-address');
    expect(shippingAddress.required).toBe(true);
    expect(!!shippingAddress.requireName).toBe(false);
    expect(!!shippingAddress.showName).toBe(false);

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('requires the customer name on sc-order-shipping-address if shipping address is required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator, ScCustomerName, ScOrderShippingAddress],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    await page.waitForChanges();

    const shippingAddress = page.root.querySelector('sc-order-shipping-address');
    expect(shippingAddress.required).toBe(true);
    expect(shippingAddress.requireName).toBe(true);
    expect(shippingAddress.showName).toBe(true);

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });
});
