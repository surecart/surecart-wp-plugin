import { newSpecPage } from '@stencil/core/testing';
import { CEStripeElement } from '../sc-stripe-element';

describe('sc-stripe-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEStripeElement],
      html: `<sc-stripe-element></sc-stripe-element>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
