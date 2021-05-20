import { newSpecPage } from '@stencil/core/testing';
import { PrestoDivider } from '../presto-divider';

describe('presto-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoDivider],
      html: `<presto-divider></presto-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-divider>
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
      </presto-divider>
    `);
  });
});
