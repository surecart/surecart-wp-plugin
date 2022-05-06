import { newSpecPage } from '@stencil/core/testing';
import { ScProcessorProvider } from '../sc-processor-provider';

describe('sc-processor-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProcessorProvider],
      html: `<sc-processor-provider></sc-processor-provider>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-processor-provider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-processor-provider>
    `);
  });
});
