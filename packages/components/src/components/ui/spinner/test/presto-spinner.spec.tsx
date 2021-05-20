import { newSpecPage } from '@stencil/core/testing';
import { PrestoSpinner } from '../presto-spinner';

describe('presto-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoSpinner],
      html: `<presto-spinner></presto-spinner>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-spinner>
        <mock:shadow-root>
          <span aria-busy="true" aria-live="polite" class="spinner" part="base"></span>
        </mock:shadow-root>
      </presto-spinner>
    `);
  });
});
