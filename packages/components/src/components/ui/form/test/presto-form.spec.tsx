import { newSpecPage } from '@stencil/core/testing';
import { PrestoForm } from '../presto-form';

describe('presto-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoForm],
      html: `<presto-form></presto-form>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-form>
        <mock:shadow-root>
          <div class="form" part="base" role="form">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </presto-form>
    `);
  });
});
