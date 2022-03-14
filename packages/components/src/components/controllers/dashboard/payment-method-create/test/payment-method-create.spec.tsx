import { newSpecPage } from '@stencil/core/testing';
import { CePaymentMethodCreate } from '../payment-method-create';

describe('ce-payment-method-create', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePaymentMethodCreate],
      html: `<ce-payment-method-create></ce-payment-method-create>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
