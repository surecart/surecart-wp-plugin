import { newSpecPage } from '@stencil/core/testing';
import { CEDivider } from '../ce-divider';

describe('ce-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEDivider],
      html: `<ce-divider></ce-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-divider>
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
      </ce-divider>
    `);
  });
});
