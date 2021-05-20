import { newSpecPage } from '@stencil/core/testing';
import { PrestoMenu } from '../presto-menu';

describe('presto-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoMenu],
      html: `<presto-menu></presto-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-menu>
        <mock:shadow-root>
          <div part="base" class="menu" role="menu" tabindex="0">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </presto-menu>
    `);
  });
});
