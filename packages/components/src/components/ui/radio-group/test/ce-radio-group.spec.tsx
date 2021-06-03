import { newSpecPage } from '@stencil/core/testing';
import { CERadioGroup } from '../ce-radio-group';

describe('ce-radio-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CERadioGroup],
      html: `<ce-radio-group></ce-radio-group>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-radio-group>
        <mock:shadow-root>
          <fieldset class="radio-group" part="base" role="radiogroup">
            <legend class="radio-group__label" part="label">
              <slot name="label"></slot>
            </legend>
            <slot></slot>
          </fieldset>
        </mock:shadow-root>
      </ce-radio-group>
    `);
  });
});
