import { newSpecPage } from '@stencil/core/testing';
import { ScDialog } from '../sc-dialog';

describe('sc-dialog', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDialog],
      html: `<sc-dialog></sc-dialog>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-dialog>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-dialog>
    `);
  });
});
