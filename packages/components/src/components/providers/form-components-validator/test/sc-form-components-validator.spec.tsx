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

// Mock the checkout module
jest.mock('@store/checkout', () => ({
  state: { checkout: null, formId: null },
  onChange: jest.fn(() => jest.fn()), // Return a cleanup function
}));

// Mock the getters
jest.mock('@store/checkout/getters', () => ({
  fullShippingAddressRequired: jest.fn(() => false),
  shippingAddressRequired: jest.fn(() => false),
}));

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Checkout, TaxProtocol } from '../../../../types';
import { state as checkoutState } from '@store/checkout';
import { ScFormComponentsValidator } from '../sc-form-components-validator';
import { ScCustomerName } from '../../../controllers/checkout-form/customer-name/sc-customer-name';
import { ScOrderShippingAddress } from '../../../controllers/checkout-form/order-shipping-address/sc-order-shipping-address';
import { shippingAddressRequired } from '@store/checkout/getters';

// Mock the getter functions
const mockShippingAddressRequired = shippingAddressRequired as jest.MockedFunction<typeof shippingAddressRequired>;

describe('sc-form-components-validator', () => {
  beforeEach(() => {
    checkoutState.checkout = null;
    checkoutState.formId = null;
    mockShippingAddressRequired.mockReturnValue(false);
    jest.clearAllMocks();
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
    mockShippingAddressRequired.mockReturnValue(true);

    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });

    // Wait for components to initialize
    await page.waitForChanges();

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
    mockShippingAddressRequired.mockReturnValue(true);

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
          <sc-order-shipping-address></sc-order-shipping-address>
        </sc-form-components-validator>
      ),
    });

    // Wait for components to initialize
    await page.waitForChanges();

    // Set up the checkout state
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    await page.waitForChanges();

    // Get the instance and trigger the handler
    const instance = page.rootInstance as ScFormComponentsValidator;
    instance.handleShippingAddressRequired();
    await page.waitForChanges();

    const customerName = page.root.querySelector('sc-customer-name');
    expect(customerName.required).toBe(true);

    const shippingAddressElement = page.root.querySelector('sc-order-shipping-address');
    expect(shippingAddressElement.required).toBe(true);
    expect(!!shippingAddressElement.requireName).toBe(false);
    expect(!!shippingAddressElement.showName).toBe(false);

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });

  it('requires the customer name on sc-order-shipping-address if shipping address is required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator, ScCustomerName, ScOrderShippingAddress],
      template: () => (
        <sc-form-components-validator disabled={false}>
          <sc-payment></sc-payment>
          <sc-order-shipping-address></sc-order-shipping-address>
        </sc-form-components-validator>
      ),
    });

    // Wait for components to initialize
    await page.waitForChanges();

    // Set up the checkout state
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    await page.waitForChanges();

    // Get the instance and trigger the handler
    const instance = page.rootInstance as ScFormComponentsValidator;
    instance.handleShippingAddressRequired();
    await page.waitForChanges();

    const shippingAddressElement = page.root.querySelector('sc-order-shipping-address');
    expect(shippingAddressElement.required).toBe(true);
    expect(shippingAddressElement.requireName).toBe(true);
    expect(shippingAddressElement.showName).toBe(true);

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback();
  });
});