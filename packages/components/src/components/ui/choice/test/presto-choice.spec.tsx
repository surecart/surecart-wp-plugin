import { newSpecPage } from '@stencil/core/testing';
import { PrestoChoice } from '../presto-choice';

describe('presto-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoChoice],
      html: `<presto-choice></presto-choice>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-choice>
        <mock:shadow-root>
          <label class="choice" htmlfor="choice-1" part="base">
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
              <div class="choice__title" part="title">
                <slot></slot>
              </div>
              <div class="choice__description" part="description">
                <slot name="description"></slot>
              </div>
            </span>
          </label>
        </mock:shadow-root>
      </presto-choice>
    `);
  });
});
