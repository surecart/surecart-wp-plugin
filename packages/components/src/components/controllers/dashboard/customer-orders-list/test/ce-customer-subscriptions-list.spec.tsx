import { newSpecPage } from '@stencil/core/testing';
import { CeCustomerSubscriptionsList } from '../ce-customer-orders-list';

describe('ce-customer-subscriptions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCustomerSubscriptionsList],
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
