import { newSpecPage } from '@stencil/core/testing';
import { ScStripeAddMethod } from '../sc-stripe-add-method';

describe('sc-stripe-add-method', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScStripeAddMethod],
      html: `<sc-stripe-add-method></sc-stripe-add-method>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
