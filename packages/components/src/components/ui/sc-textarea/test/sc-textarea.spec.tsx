import { newSpecPage } from '@stencil/core/testing';
import { ScTextarea } from '../sc-textarea';

describe('sc-textarea', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTextarea],
      html: `<sc-textarea></sc-textarea>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-textarea>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-textarea>
    `);
  });
});
