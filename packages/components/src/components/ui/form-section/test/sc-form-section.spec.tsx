import { newSpecPage } from '@stencil/core/testing';
import { CEFormSection } from '../sc-form-section';

describe('sc-form-section', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEFormSection],
      html: `<sc-form-section></sc-form-section>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-form-section>
        <mock:shadow-root>
          <div class="section">
            <div class="section__label">
              <h3 class="section__title" part="title">
                <slot name="label"></slot>
              </h3>
              <div class="section__description" part="description">
                <slot name="description"></slot>
              </div>
            </div>
            <slot></slot>
          </div>
        </mock:shadow-root>
      </sc-form-section>
    `);
  });
});
