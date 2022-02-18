import { newSpecPage } from '@stencil/core/testing';
import { CeFormComponentsValidator } from '../ce-form-components-validator';

describe('ce-form-components-validator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeFormComponentsValidator],
      html: `<ce-form-components-validator></ce-form-components-validator>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-form-components-validator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-form-components-validator>
    `);
  });
});
