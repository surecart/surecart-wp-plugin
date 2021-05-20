import { newSpecPage } from '@stencil/core/testing';
import { PrestoRadioGroup } from '../presto-radio-group';

describe('presto-radio-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoRadioGroup],
      html: `<presto-radio-group></presto-radio-group>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-radio-group>
        <mock:shadow-root>
          <fieldset class="radio-group" part="base" role="radiogroup">
            <legend class="radio-group__label" part="label">
              <slot name="label"></slot>
            </legend>
            <slot></slot>
          </fieldset>
        </mock:shadow-root>
      </presto-radio-group>
    `);
  });
});
