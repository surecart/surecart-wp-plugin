import { newSpecPage } from '@stencil/core/testing';
import { CEForm } from '../ce-form';

describe('ce-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEForm],
      html: `<ce-form></ce-form>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-form>
        <mock:shadow-root>
          <div class="form" part="base" role="form">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </ce-form>
    `);
  });
});
