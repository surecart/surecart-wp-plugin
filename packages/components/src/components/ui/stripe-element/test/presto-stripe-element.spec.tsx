import { newSpecPage } from '@stencil/core/testing';
import { PrestoStripeElement } from '../presto-stripe-element';

describe('presto-stripe-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoStripeElement],
      html: `<presto-stripe-element></presto-stripe-element>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-stripe-element size="medium">
        <presto-input class="presto-stripe" help="" size="medium">
          <div></div>
        </presto-input>
      </presto-stripe-element>
    `);
  });
});
