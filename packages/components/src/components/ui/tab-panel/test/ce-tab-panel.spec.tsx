import { newSpecPage } from '@stencil/core/testing';
import { CeTabPanel } from '../ce-tab-panel';

describe('ce-tab-panel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTabPanel],
      html: `<ce-tab-panel></ce-tab-panel>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
