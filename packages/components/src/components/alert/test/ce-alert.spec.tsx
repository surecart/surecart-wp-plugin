import { newSpecPage } from '@stencil/core/testing';
import { CeAlert } from '../ce-alert';

describe('ce-alert', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeAlert],
      html: `<ce-alert></ce-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-alert>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-alert>
    `);
  });
});
