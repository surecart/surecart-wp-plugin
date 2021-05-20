import { newSpecPage } from '@stencil/core/testing';
import { PrestoCheckbox } from '../presto-checkbox';

describe('presto-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoCheckbox],
      html: `<presto-checkbox></presto-checkbox>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-checkbox>
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
      </presto-checkbox>
    `);
  });
});
