import { newSpecPage } from '@stencil/core/testing';
import { CeSubscriptionPayment } from '../ce-subscription-payment';

describe('ce-subscription-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSubscriptionPayment],
      html: `<ce-subscription-payment></ce-subscription-payment>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-subscription-payment>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-subscription-payment>
    `);
  });
});
