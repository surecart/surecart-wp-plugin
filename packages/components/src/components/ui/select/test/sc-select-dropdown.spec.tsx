import { newSpecPage } from '@stencil/core/testing';
import { ScSelectDropdown } from '../sc-select';

describe('sc-select-dropdown', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSelectDropdown],
      html: `<sc-select-dropdown></sc-select-dropdown>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
