import { newSpecPage } from '@stencil/core/testing';
import { CESpinner } from '../sc-spinner';

describe('sc-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESpinner],
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
