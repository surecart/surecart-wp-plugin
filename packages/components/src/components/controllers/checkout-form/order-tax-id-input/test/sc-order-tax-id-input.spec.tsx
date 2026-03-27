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
import { ScOrderTaxIdInput } from '../sc-order-tax-id-input';
import { state as checkoutState, dispose as disposeCheckout } from '@store/checkout';
import { Checkout, TaxProtocol } from 'src/types';

beforeEach(() => {
  disposeCheckout();
});

describe('sc-order-tax-id-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      html: `<sc-order-tax-id-input></sc-order-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Renders UK VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input></sc-order-tax-id-input>,
    });
    checkoutState.checkout = { id: 'test', shipping_address: { country: 'GB' } } as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('Renders EU VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input></sc-order-tax-id-input>,
    });
    checkoutState.checkout = { id: 'test', shipping_address: { country: 'DE' } } as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('Renders CA Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input></sc-order-tax-id-input>,
    });
    checkoutState.checkout = { id: 'test', shipping_address: { country: 'CA' } } as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('Renders AU Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input></sc-order-tax-id-input>,
    });
    checkoutState.checkout = { id: 'test', shipping_address: { country: 'AU' } } as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('Defaults to type and number first', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input></sc-order-tax-id-input>,
    });
    checkoutState.checkout = { id: 'test', shipping_address: { country: 'AU' }, tax_identifier: { number: '123', number_type: 'eu_vat' } } as Checkout;
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
  it('Renders with Help Text', async () => {
    const helpText = 'Enter your tax identifier';
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input helpText={helpText}></sc-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Should be required when required prop is true', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input required={true}></sc-order-tax-id-input>,
    });
    const taxIdInput = page.root.shadowRoot.querySelector('sc-tax-id-input');
    expect(taxIdInput.getAttribute('required')).not.toBeNull();
  });

  it('Should respect EU VAT protocol when required is false and eu_vat is selected', async () => {
    checkoutState.taxProtocol = { eu_vat_required: true } as TaxProtocol;
    checkoutState.checkout = { id: 'test', tax_identifier: { number_type: 'eu_vat' } } as Checkout;
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input required={false}></sc-order-tax-id-input>,
    });
    await page.waitForChanges();
    const taxIdInput = page.root.shadowRoot.querySelector('sc-tax-id-input');
    expect(taxIdInput.getAttribute('required')).not.toBeNull();
  });
});
