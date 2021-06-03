import { newSpecPage } from '@stencil/core/testing';
import { CESelect } from '../ce-select';

describe('ce-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESelect],
      html: `<ce-select></ce-select>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-select>
        <mock:shadow-root>
          <ce-form-control helpid="select-help-text-1" inputid="select-1" labelid="select-label-1" size="medium">
            <ce-dropdown class="select select--empty select--medium select--placeholder-visible" closeonselect="" part="base">
              <div aria-expanded="false" aria-haspopup="true" class="select__box" id="select-1" role="combobox" slot="trigger" tabindex="0">
                <div class="select__label"></div>
              </div>
              <ce-menu class="select__menu" part="menu">
                <slot></slot>
              </ce-menu>
            </ce-dropdown>
            <input aria-hidden="true" class="select__hidden-select" tabindex="-1" value="">
          </ce-form-control>
        </mock:shadow-root>
      </ce-select>
    `);
  });
});
