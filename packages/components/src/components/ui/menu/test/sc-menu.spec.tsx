import { newSpecPage } from '@stencil/core/testing';
import { CEMenu } from '../sc-menu';

describe('sc-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEMenu],
      html: `<sc-menu></sc-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-menu>
        <mock:shadow-root>
          <div part="base" class="menu" role="menu" tabindex="0">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </sc-menu>
    `);
  });
});
