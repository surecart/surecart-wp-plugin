import { newSpecPage } from '@stencil/core/testing';
import { CEStripeElement } from '../ce-stripe-element';

describe('ce-stripe-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEStripeElement],
      html: `<ce-stripe-element></ce-stripe-element>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
