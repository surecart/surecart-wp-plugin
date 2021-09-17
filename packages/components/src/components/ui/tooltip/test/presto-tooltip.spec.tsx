import { newSpecPage } from '@stencil/core/testing';
import { PrestoTooltip } from '../ce-tooltip';

describe('presto-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoTooltip],
      html: `<presto-tooltip></presto-tooltip>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-tooltip>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </presto-tooltip>
    `);
  });
});
