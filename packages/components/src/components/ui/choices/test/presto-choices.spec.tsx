import { newSpecPage } from '@stencil/core/testing';
import { PrestoChoices } from '../presto-choices';

describe('presto-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoChoices],
      html: `<presto-choices></presto-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-choices>
        <mock:shadow-root>
          <fieldset class="choices" part="base" role="radiogroup">
            <div class="choices__label" part="label">
              <slot name="label"></slot>
            </div>
            <slot></slot>
          </fieldset>
        </mock:shadow-root>
      </presto-choices>
    `);
  });
});
