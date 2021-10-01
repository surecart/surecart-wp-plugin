import { newSpecPage } from '@stencil/core/testing';
import { CeSelectDropdown } from '../ce-select';

describe('ce-select-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSelectDropdown],
      html: `<ce-select-dropdown></ce-select-dropdown>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
