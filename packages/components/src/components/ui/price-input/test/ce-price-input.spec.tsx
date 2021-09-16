import { newSpecPage } from '@stencil/core/testing';
import { CePriceInput } from '../ce-price-input';

describe('ce-price-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceInput],
      html: `<ce-price-input></ce-price-input>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-price-input size="medium">
        <mock:shadow-root>
          <div>
            <ce-input help="" inputmode="decimal" min="0" showlabel="" size="medium" step="0.001" type="number" value="NaN">
              <span slot="prefix" style="opacity: 0.5;">
                $
              </span>
            </ce-input>
          </div>
        </mock:shadow-root>
      </ce-price-input>
    `);
  });
});
