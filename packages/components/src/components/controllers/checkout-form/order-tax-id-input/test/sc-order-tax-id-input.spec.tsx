import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ScOrderTaxIdInput } from '../sc-order-tax-id-input';

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
      template: () => <sc-order-tax-id-input order={{ shipping_address: { country: 'GB' } }}></sc-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders EU VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input order={{ shipping_address: { country: 'DE' } }}></sc-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders CA Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input order={{ shipping_address: { country: 'CA' } }}></sc-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders AU Tax Type', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input order={{ shipping_address: { country: 'AU' } }}></sc-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Defaults to type and number first', async () => {
    const page = await newSpecPage({
      components: [ScOrderTaxIdInput],
      template: () => <sc-order-tax-id-input order={{ shipping_address: { country: 'AU' }, tax_identifier: { number: '123456', number_type: 'eu_vat' } }}></sc-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
