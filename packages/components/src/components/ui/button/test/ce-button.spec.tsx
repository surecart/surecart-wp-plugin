import { newSpecPage } from '@stencil/core/testing';
import { CEButton } from '../ce-button';

describe('ce-button', () => {
  let element, page;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [CEButton],
      html: '<ce-button></ce-button>',
    });
    element = await page.doc.querySelector('ce-button');
  });

  it('renders', async () => {
    expect(page.root).toEqualHtml(`
      <ce-button size="medium" type="default">
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
      </ce-button>
    `);
  });

  it('renders slots', async () => {
    const page = await newSpecPage({
      components: [CEButton],
      html: `<ce-button>
        <span slot="prefix">Prefix</span>
        Text
        <span slot="suffix">Suffix</span>
      </ce-button>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-button size="medium" type="default">
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
      </ce-button>
    `);
  });
});
