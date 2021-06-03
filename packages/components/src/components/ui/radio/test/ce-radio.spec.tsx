import { newSpecPage } from '@stencil/core/testing';
import { CERadio } from '../ce-radio';

describe('ce-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CERadio],
      html: `<ce-radio></ce-radio>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-radio>
        <mock:shadow-root>
          <label class="radio" htmlfor="radio-1" part="base">
            <span class="radio__control" part="control">
              <span class="radio__icon" part="checked-icon">
                <svg viewBox="0 0 16 16">
                  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                    <g fill="currentColor">
                      <circle cx="8" cy="8" r="3.42857143"></circle>
                    </g>
                  </g>
                </svg>
              </span>
              <input aria-checked="false" aria-disabled="false" aria-labelledby="radio-label-1" id="radio-1" type="radio">
            </span>
            <span class="radio__label" id="radio-label-1" part="label">
              <slot></slot>
            </span>
          </label>
        </mock:shadow-root>
      </ce-radio>
    `);
  });
});
