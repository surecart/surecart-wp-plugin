import { newSpecPage } from '@stencil/core/testing';
import { CeProductLineItem } from '../ce-product-line-item';

describe('ce-product-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeProductLineItem],
      html: `<ce-product-line-item currency="CAD" amount="1000"></ce-product-line-item>`,
    });
    expect(page.root).toEqualHtml(`
    <ce-product-line-item amount="1000" currency="CAD">
       <mock:shadow-root>
         <ce-line-item>
         <span slot="title">
                  <ce-tag size="small">
                    Remove
                  </ce-tag>
                </span>
           <ce-quantity-select slot="description"></ce-quantity-select>
           <span slot="price">
             CA$10.00
           </span>
         </ce-line-item>
        </mock:shadow-root>
      </ce-product-line-item>
    `);
  });
});
