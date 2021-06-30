import { newSpecPage } from '@stencil/core/testing';
import { CEChoice } from '../ce-choice';

describe('ce-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEChoice],
      html: `<ce-choice></ce-choice>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-choice>
        <mock:shadow-root>
          <label class="choice choice--layout-columns" htmlfor="choice-1" part="base">
            <span class="choice__control choice__radio" part="control">
              <span class="choice__icon" part="checked-icon">
                <svg viewBox="0 0 16 16">
                  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                    <g fill="currentColor">
                      <circle cx="8" cy="8" r="3.42857143"></circle>
                    </g>
                  </g>
                </svg>
              </span>
              <input aria-checked="false" aria-disabled="false" aria-labelledby="choice-label-1" id="choice-1" type="radio">
            </span>
            <span class="choice__label" id="choice-label-1" part="label">
              <span class="choice__label-text">
                <span class="choice__title" part="title">
                  <slot></slot>
                </span>
                <span class="choice__description description" part="description">
                  <slot name="description"></slot>
                </span>
              </span>
              <span class="choice__price">
                <span class="choice__title">
                  <slot name="price"></slot>
                </span>
                <span class="choice__description">
                  <slot name="per"></slot>
                </span>
            </span>
          </label>
        </mock:shadow-root>
      </ce-choice>
    `);
  });
});
