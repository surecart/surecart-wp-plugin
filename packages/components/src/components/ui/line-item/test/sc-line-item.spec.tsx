import { newSpecPage } from '@stencil/core/testing';
import { CELineItem } from '../sc-line-item';

describe('sc-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CELineItem],
      html: `<sc-line-item></sc-line-item>`,
    });
    expect(page.root).toEqualHtml(`
    <sc-line-item>
    <mock:shadow-root>
      <div class="item" part="base">
        <div class="item__image" part="image">
          <slot name="image"></slot>
        </div>
        <div class="item__text" part="text">
          <div class="item__title">
            <slot name="title"></slot>
          </div>
          <div class="item__description">
            <slot name="description"></slot>
          </div>
        </div>
        <div class="item__end" part="price">
          <div class="item__price-currency">
            <slot name="currency"></slot>
          </div>
          <div class="item__price-text">
            <div class="item__price">
              <slot name="price"></slot>
            </div>
            <div class="item__price-description">
              <slot name="price-description"></slot>
            </div>
          </div>
        </div>
      </div>
    </mock:shadow-root>
  </sc-line-item>
    `);
  });
});
