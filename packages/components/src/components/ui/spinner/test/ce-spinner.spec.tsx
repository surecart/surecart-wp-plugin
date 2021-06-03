import { newSpecPage } from '@stencil/core/testing';
import { CESpinner } from '../ce-spinner';

describe('ce-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESpinner],
      html: `<ce-spinner></ce-spinner>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-spinner>
        <mock:shadow-root>
          <span aria-busy="true" aria-live="polite" class="spinner" part="base"></span>
        </mock:shadow-root>
      </ce-spinner>
    `);
  });
});
