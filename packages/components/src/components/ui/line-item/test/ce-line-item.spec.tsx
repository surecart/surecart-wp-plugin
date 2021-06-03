import { newSpecPage } from '@stencil/core/testing';
import { CELineItem } from '../ce-line-item';

describe('ce-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CELineItem],
      html: `<ce-line-item></ce-line-item>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-line-item>
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
      </ce-line-item>
    `);
  });
});
