import { newSpecPage } from '@stencil/core/testing';
import { CeTabGroup } from '../ce-tab-group';

describe('ce-tab-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTabGroup],
      html: `<ce-tab-group></ce-tab-group>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
