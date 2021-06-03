import { newSpecPage } from '@stencil/core/testing';
import { CECheckbox } from '../ce-checkbox';

describe('ce-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CECheckbox],
      html: `<ce-checkbox></ce-checkbox>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-checkbox>
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
      </ce-checkbox>
    `);
  });
});
