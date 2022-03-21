import { newSpecPage } from '@stencil/core/testing';
import { ScPaymentMethodCreate } from '../payment-method-create';

describe('sc-payment-method-create', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodCreate],
      html: `<sc-payment-method-create></sc-payment-method-create>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
