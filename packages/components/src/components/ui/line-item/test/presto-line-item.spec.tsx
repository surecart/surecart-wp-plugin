import { newSpecPage } from '@stencil/core/testing';
import { PrestoLineItem } from '../presto-line-item';

describe('presto-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoLineItem],
      html: `<presto-line-item></presto-line-item>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-line-item>
        <mock:shadow-root>
          <div class="item" part="base">
            <div class="item__title" part="title">
              <slot></slot>
            </div>
            <div class="item__price" part="price">
              <slot name="price">
                <div class="item__price-layout">
                  <span class="item_currency"></span>
                </div>
              </slot>
            </div>
          </div>
        </mock:shadow-root>
      </presto-line-item>
    `);
  });
});
