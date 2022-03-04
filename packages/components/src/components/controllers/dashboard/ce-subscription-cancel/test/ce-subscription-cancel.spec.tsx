import { newSpecPage } from '@stencil/core/testing';
import { CeSubscriptionCancel } from '../ce-subscription-cancel';

describe('ce-subscription-cancel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSubscriptionCancel],
      html: `<ce-subscription-cancel></ce-subscription-cancel>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-subscription-cancel>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-subscription-cancel>
    `);
  });
});
