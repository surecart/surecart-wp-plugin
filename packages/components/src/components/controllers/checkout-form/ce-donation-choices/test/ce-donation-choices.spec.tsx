import { newSpecPage } from '@stencil/core/testing';
import { CeDonationChoices } from '../ce-donation-choices';

describe('ce-donation-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeDonationChoices],
      html: `<ce-donation-choices></ce-donation-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-donation-choices>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-donation-choices>
    `);
  });
});
