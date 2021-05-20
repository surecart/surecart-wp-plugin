import { newSpecPage } from '@stencil/core/testing';
import { PrestoFormRow } from '../presto-form-row';

describe('presto-form-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoFormRow],
      html: `<presto-form-row></presto-form-row>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-form-row>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </presto-form-row>
    `);
  });
});
