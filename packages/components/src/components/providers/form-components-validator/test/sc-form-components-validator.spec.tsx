import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Checkout, TaxProtocol } from '../../../../types';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { ScFormComponentsValidator } from '../sc-form-components-validator';

describe('sc-form-components-validator', () => {
  beforeEach(() => {
    disposeCheckout();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      html: `<sc-form-components-validator></sc-form-components-validator>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('appends missing address field if required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    page.root.order = { tax_status: 'address_invalid' } as Checkout;
    page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('appends missing tax id input if required', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator taxProtocol={{ tax_enabled: true, eu_vat_required: true } as TaxProtocol}>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('appends missing address field with shipping address required, customer name required in sc-customer-name',async () => {
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator>
          <sc-customer-name></sc-customer-name>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('makes the sc-customer-name required if address field is already present', async () => {
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator>
          <sc-address></sc-address>
          <sc-customer-name></sc-customer-name>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  })

  it('makes the address field required, requireName and showName if sc-customer-name is absent', async () => {
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator>
          <sc-payment></sc-payment>
          <sc-address></sc-address>
        </sc-form-components-validator>
      ),
    });
    page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  })
});
