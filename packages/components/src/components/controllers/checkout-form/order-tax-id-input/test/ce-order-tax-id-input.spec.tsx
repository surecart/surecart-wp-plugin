import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { CeOrderTaxIdInput } from '../ce-order-tax-id-input';

describe('ce-order-tax-id-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderTaxIdInput],
      html: `<ce-order-tax-id-input></ce-order-tax-id-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders UK VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeOrderTaxIdInput],
      template: () => <ce-order-tax-id-input order={{ shipping_address: { country: 'GB' } }}></ce-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders EU VAT Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeOrderTaxIdInput],
      template: () => <ce-order-tax-id-input order={{ shipping_address: { country: 'DE' } }}></ce-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders CA Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeOrderTaxIdInput],
      template: () => <ce-order-tax-id-input order={{ shipping_address: { country: 'CA' } }}></ce-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Renders AU Tax Type', async () => {
    const page = await newSpecPage({
      components: [CeOrderTaxIdInput],
      template: () => <ce-order-tax-id-input order={{ shipping_address: { country: 'AU' } }}></ce-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
  it('Defaults to type and number first', async () => {
    const page = await newSpecPage({
      components: [CeOrderTaxIdInput],
      template: () => <ce-order-tax-id-input order={{ shipping_address: { country: 'AU' }, tax_identifier: { number: '123456', number_type: 'eu_vat' } }}></ce-order-tax-id-input>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
