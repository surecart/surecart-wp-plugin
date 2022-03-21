import { newSpecPage } from '@stencil/core/testing';
import { ScRadioGroup } from '../sc-radio-group';

describe('sc-radio-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScRadioGroup],
      html: `<sc-radio-group></sc-radio-group>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-radio-group>
        <mock:shadow-root>
          <fieldset class="radio-group" part="base" role="radiogroup">
            <legend class="radio-group__label" part="label">
              <slot name="label"></slot>
            </legend>
            <slot></slot>
          </fieldset>
        </mock:shadow-root>
      </sc-radio-group>
    `);
  });
});
