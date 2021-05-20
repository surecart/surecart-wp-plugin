import { newSpecPage } from '@stencil/core/testing';
import { PrestoFormControl } from '../presto-form-control';

describe('presto-form-control', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoFormControl],
      html: `<presto-form-control></presto-form-control>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-form-control size="medium">
        <mock:shadow-root>
          <div class="form-control form-control--medium" part="form-control">
            <label aria-hidden="true" class="form-control__label" part="label">
              <slot name="label"></slot>
            </label>
            <div class="form-control__input">
              <slot></slot>
            </div>
          </div>
        </mock:shadow-root>
      </presto-form-control>
    `);
  });
});
