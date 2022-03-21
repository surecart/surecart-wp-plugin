import { newSpecPage } from '@stencil/core/testing';
import { ScDonationChoices } from '../sc-donation-choices';

describe('sc-donation-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDonationChoices],
      html: `<sc-donation-choices></sc-donation-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-donation-choices>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-donation-choices>
    `);
  });
});
