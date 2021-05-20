import { newSpecPage } from '@stencil/core/testing';
import { PrestoButton } from '../presto-button';

describe('presto-button', () => {
  let element, page;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [PrestoButton],
      html: '<presto-button></presto-button>',
    });
    element = await page.doc.querySelector('presto-button');
  });

  it('renders', async () => {
    expect(page.root).toEqualHtml(`
      <presto-button size="medium" type="default">
        <mock:shadow-root>
          <button class="button button--default button--has-label button--medium" part="base" type="button">
            <span class="button__prefix" part="prefix">
              <slot name="prefix"></slot>
            </span>
            <span class="button__label" part="label">
              <slot></slot>
            </span>
            <span class="button__suffix" part="suffix">
              <slot name="suffix"></slot>
            </span>
          </button>
        </mock:shadow-root>
      </presto-button>
    `);
  });

  it('renders slots', async () => {
    const page = await newSpecPage({
      components: [PrestoButton],
      html: `<presto-button>
        <span slot="prefix">Prefix</span>
        Text
        <span slot="suffix">Suffix</span>
      </presto-button>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-button size="medium" type="default">
        <mock:shadow-root>
          <button class="button button--default button--has-label button--has-prefix button--has-suffix button--medium" part="base" type="button">
            <span class="button__prefix" part="prefix">
              <slot name="prefix"></slot>
            </span>
            <span class="button__label" part="label">
              <slot></slot>
            </span>
            <span class="button__suffix" part="suffix">
              <slot name="suffix"></slot>
            </span>
          </button>
          </mock:shadow-root>

          <span slot="prefix">
            Prefix
          </span>
            Text
          <span slot="suffix">
            Suffix
          </span>
      </presto-button>
    `);
  });
});
