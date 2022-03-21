import { newSpecPage } from '@stencil/core/testing';
import { ScSpinner } from '../sc-spinner';

describe('sc-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSpinner],
      html: `<sc-spinner></sc-spinner>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-spinner>
        <mock:shadow-root>
          <span aria-busy="true" aria-live="polite" class="spinner" part="base"></span>
        </mock:shadow-root>
      </sc-spinner>
    `);
  });
});
