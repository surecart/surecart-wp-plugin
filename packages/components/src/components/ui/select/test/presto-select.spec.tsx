import { newSpecPage } from '@stencil/core/testing';
import { PrestoSelect } from '../presto-select';

describe('presto-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoSelect],
      html: `<presto-select></presto-select>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-select>
        <mock:shadow-root>
          <presto-form-control helpid="select-help-text-1" inputid="select-1" labelid="select-label-1" size="medium">
            <presto-dropdown class="select select--empty select--medium select--placeholder-visible" closeonselect="" part="base">
              <div aria-expanded="false" aria-haspopup="true" class="select__box" id="select-1" role="combobox" slot="trigger" tabindex="0">
                <div class="select__label"></div>
              </div>
              <presto-menu class="select__menu" part="menu">
                <slot></slot>
              </presto-menu>
            </presto-dropdown>
            <input aria-hidden="true" class="select__hidden-select" tabindex="-1" value="">
          </presto-form-control>
        </mock:shadow-root>
      </presto-select>
    `);
  });
});
