import { newSpecPage } from '@stencil/core/testing';
import { CePriceChoices } from '../ce-price-choices';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      html: `<ce-price-choices></ce-price-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-price-choices>
        <ce-consumer></ce-consumer>
      </ce-price-choices>
    `);
  });
});
