import { newSpecPage } from '@stencil/core/testing';
import { PrestoSwitch } from '../presto-switch';

describe('presto-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoSwitch],
      html: `<presto-switch></presto-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-switch>
        <mock:shadow-root>
          <label class="switch" htmlFor="switch-1" part="base">
            <span class="switch__control" part="control">
              <span class="switch__thumb" part="thumb"></span>
              <input aria-checked="false" aria-labelledby="switch-label-1" id="switch-1" role="switch" type="checkbox">
            </span>
            <span class="switch__label">
              <span class="switch__title" id="switch-label-1" part="title">
                <slot></slot>
              </span>
              <span class="switch__description" part="description">
                <slot name="description"></slot>
              </span>
            </span>
          </label>
        </mock:shadow-root>
      </presto-switch>
    `);
  });
});
