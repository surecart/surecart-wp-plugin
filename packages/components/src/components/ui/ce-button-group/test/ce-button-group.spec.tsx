import { newSpecPage } from '@stencil/core/testing';
import { CeButtonGroup } from '../ce-button-group';

describe('ce-button-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeButtonGroup],
      html: `<ce-button-group></ce-button-group>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-button-group>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-button-group>
    `);
  });
});
