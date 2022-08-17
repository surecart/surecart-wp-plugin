import { ScPaymentMethod } from '../sc-payment-method';
import { newSpecPage } from '@stencil/core/testing';

describe('sc-payment-method', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethod],
      html: `<sc-payment-method></sc-payment-method>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
