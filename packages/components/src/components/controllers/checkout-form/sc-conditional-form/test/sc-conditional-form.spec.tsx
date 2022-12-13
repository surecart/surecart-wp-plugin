import { newSpecPage } from '@stencil/core/testing';
import { ScConditionalForm } from '../sc-conditional-form';

describe('sc-conditional-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScConditionalForm],
      html: `<sc-conditional-form></sc-conditional-form>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-conditional-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-conditional-form>
    `);
  });
});
