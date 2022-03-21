import { newSpecPage } from '@stencil/core/testing';
import { ScFormComponentsValidator } from '../sc-form-components-validator';

describe('sc-form-components-validator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFormComponentsValidator],
      html: `<sc-form-components-validator></sc-form-components-validator>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-form-components-validator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-form-components-validator>
    `);
  });
});
