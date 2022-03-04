import { newSpecPage } from '@stencil/core/testing';
import { CeSubscriptionDetails } from '../ce-subscription-details';

describe('ce-subscription-details', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSubscriptionDetails],
      html: `<ce-subscription-details></ce-subscription-details>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-subscription-details>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-subscription-details>
    `);
  });
});
