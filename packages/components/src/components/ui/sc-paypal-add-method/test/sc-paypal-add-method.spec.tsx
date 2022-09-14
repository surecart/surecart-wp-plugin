import { newSpecPage } from '@stencil/core/testing';
import { ScPaypalAddMethod } from '../sc-paypal-add-method';

describe('sc-paypal-add-method', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaypalAddMethod],
      html: `<sc-paypal-add-method></sc-paypal-add-method>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
