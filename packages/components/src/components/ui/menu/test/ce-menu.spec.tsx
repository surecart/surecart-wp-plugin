import { newSpecPage } from '@stencil/core/testing';
import { CEMenu } from '../ce-menu';

describe('ce-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEMenu],
      html: `<ce-menu></ce-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-menu>
        <mock:shadow-root>
          <div part="base" class="menu" role="menu" tabindex="0">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </ce-menu>
    `);
  });
});
