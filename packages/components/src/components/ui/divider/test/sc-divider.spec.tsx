import { newSpecPage } from '@stencil/core/testing';
import { ScDivider } from '../sc-divider';

describe('sc-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDivider],
      html: `<sc-divider></sc-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-divider>
        <mock:shadow-root>
          <div class="divider" part="base">
            <div aria-hidden="true" class="line__container">
              <div class="line" part="line"></div>
            </div>
            <div class="text__container">
              <span class="text" part="text">
                <slot></slot>
              </span>
            </div>
          </div>
        </mock:shadow-root>
      </sc-divider>
    `);
  });
});
