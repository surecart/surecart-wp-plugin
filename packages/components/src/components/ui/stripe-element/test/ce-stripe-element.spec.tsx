import { newSpecPage } from '@stencil/core/testing';
import { CEStripeElement } from '../ce-stripe-element';

describe('ce-stripe-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEStripeElement],
      html: `<ce-stripe-element></ce-stripe-element>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-stripe-element size="medium">
        <ce-input class="ce-stripe" help="" size="medium">
          <div></div>
        </ce-input>
      </ce-stripe-element>
    `);
  });
});
