import { newSpecPage } from '@stencil/core/testing';
import { CePurchase } from '../ce-purchase';

describe('ce-purchase', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePurchase],
      html: `<ce-purchase></ce-purchase>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-purchase>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-purchase>
    `);
  });
});
