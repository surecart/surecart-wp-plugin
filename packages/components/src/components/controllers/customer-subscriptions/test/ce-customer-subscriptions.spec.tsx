import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerSubscriptions } from '../ce-customer-subscriptions';

describe('ce-customer-subscriptions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerSubscriptions],
      html: `<ce-customer-subscriptions></ce-customer-subscriptions>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-customer-subscriptions>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-customer-subscriptions>
    `);
  });
});
