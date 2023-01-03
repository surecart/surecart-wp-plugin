import { newSpecPage } from '@stencil/core/testing';
import { ScCancelDialog } from '../sc-cancel-dialog';

describe('sc-cancel-dialog', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCancelDialog],
      html: `<sc-cancel-dialog></sc-cancel-dialog>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-cancel-dialog>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-cancel-dialog>
    `);
  });
});
