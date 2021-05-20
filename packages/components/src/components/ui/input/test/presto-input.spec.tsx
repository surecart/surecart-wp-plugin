import { newSpecPage } from '@stencil/core/testing';
import { PrestoInput } from '../presto-input';

describe('presto-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoInput],
      html: `<presto-input></presto-input>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-input size="medium" type="text">
        <mock:shadow-root>
          <presto-form-control help="" helpid="input-help-text-1" inputid="input-1" labelid="input-label-1" showLabel="" size="medium">
            <div class="input input--medium" part="base">
              <span class="input__prefix" part="prefix">
                <slot name="prefix"></slot>
              </span>
              <slot>
                <input class="input__control" id="input-1" part="input" type="text" value="">
              </slot>
              <span class="input__suffix" part="suffix">
                <slot name="suffix"></slot>
              </span>
            </div>
          </presto-form-control>
        </mock:shadow-root>
      </presto-input>
    `);
  });
});
