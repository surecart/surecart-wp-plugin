import { newSpecPage } from '@stencil/core/testing';
import { CEFormControl } from '../ce-form-control';

describe('ce-form-control', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEFormControl],
      html: `<ce-form-control></ce-form-control>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-form-control size="medium">
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
      </ce-form-control>
    `);
  });
});
