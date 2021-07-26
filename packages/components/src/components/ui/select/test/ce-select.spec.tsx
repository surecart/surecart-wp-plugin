import { newSpecPage } from '@stencil/core/testing';
import { CeSelect } from '../ce-select';

describe('ce-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSelect],
      html: `<ce-select></ce-select>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-select size="medium">
        <mock:shadow-root>
          <ce-form-control help="" helpid="input-help-text-1" inputid="input-1" labelid="input-label-1" showlabel="" size="medium">
            <div>
              <select></select>
            </div>
          </ce-form-control>
        </mock:shadow-root>
      </ce-select>
    `);
  });
});
