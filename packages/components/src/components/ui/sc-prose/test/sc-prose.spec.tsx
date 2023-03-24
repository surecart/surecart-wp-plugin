import { newSpecPage } from '@stencil/core/testing';
import { ScProse } from '../sc-prose';

describe('sc-prose', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProse],
      html: `<sc-prose></sc-prose>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-prose>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-prose>
    `);
  });
});
