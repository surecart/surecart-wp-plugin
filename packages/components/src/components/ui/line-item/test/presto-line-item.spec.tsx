import { newSpecPage } from '@stencil/core/testing';
import { PrestoLineItem } from '../presto-line-item';

describe('presto-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoLineItem],
      html: `<presto-line-item></presto-line-item>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-line-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </presto-line-item>
    `);
  });
});
