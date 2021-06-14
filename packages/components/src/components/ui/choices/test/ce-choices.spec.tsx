import { newSpecPage } from '@stencil/core/testing';
import { CEChoices } from '../ce-choices';

describe('ce-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEChoices],
      html: `<ce-choices></ce-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-choices>
        <mock:shadow-root>
          <fieldset class="choices" part="base" role="radiogroup">
            <div class="choices__label" part="label">
              <slot name="label"></slot>
            </div>
            <div class="choices__items" part="choices">
              <slot></slot>
            </div>
          </fieldset>
        </mock:shadow-root>
      </ce-choices>
    `);
  });
});
