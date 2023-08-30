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
    page.rootInstance.disconnectedCallback()
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
    checkoutState.checkout = {tax_status: 'address_invalid'} as Checkout;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback()
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
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback()
  });

  it('appends missing address field with shipping address required',async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      template: () => (
        <sc-form-components-validator>
          <sc-payment></sc-payment>
        </sc-form-components-validator>
      ),
    });
    checkoutState.checkout = { shipping_address_required: true } as Checkout;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
    page.rootInstance.disconnectedCallback()
  });
});
