import { newSpecPage } from '@stencil/core/testing';
import { ScColumn } from '../sc-column';

describe('sc-column', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScColumn],
      html: `<sc-column></sc-column>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-column>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-column>
    `);
  });
});
