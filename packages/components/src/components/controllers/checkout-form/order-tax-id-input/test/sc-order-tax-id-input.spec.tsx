import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ScOrderTaxIdInput } from '../sc-order-tax-id-input';
import { state as checkoutState, dispose as disposeCheckout } from '@store/checkout';
import { Checkout } from 'src/types';

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
});
