import { newSpecPage } from '@stencil/core/testing';
import { ScPassword } from '../sc-password';

describe('sc-password', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPassword],
      html: `<sc-password></sc-password>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-password>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-password>
    `);
  });
});
