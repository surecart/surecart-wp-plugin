import { newSpecPage } from '@stencil/core/testing';
import { ScCheckbox } from '../sc-checkbox';

describe('sc-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckbox],
      html: `<sc-checkbox></sc-checkbox>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-checkbox>
        <mock:shadow-root>
          <label class="checkbox" htmlfor="checkbox-1" part="base">
            <span class="checkbox__control" part="control">
              <input aria-checked="false" aria-labelledby="checkbox-label-1" id="checkbox-1" role="checkbox" type="checkbox">
            </span>
            <span class="checkbox__label" id="checkbox-label-1" part="label">
              <slot></slot>
            </span>
          </label>
        </mock:shadow-root>
      </sc-checkbox>
    `);
  });
});
