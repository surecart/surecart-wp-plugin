import { newSpecPage } from '@stencil/core/testing';
import { PrestoFormSection } from '../presto-form-section';

describe('presto-form-section', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoFormSection],
      html: `<presto-form-section></presto-form-section>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-form-section>
        <mock:shadow-root>
          <div class="section__label">
            <h3 class="section__title" part="title">
              <slot name="label"></slot>
            </h3>
            <div class="section__description" part="description">
              <slot name="description"></slot>
            </div>
          </div>
          <slot></slot>
        </mock:shadow-root>
      </presto-form-section>
    `);
  });
});
