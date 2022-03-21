import { newSpecPage } from '@stencil/core/testing';
import { ScTabGroup } from '../sc-tab-group';

describe('sc-tab-group', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTabGroup],
      html: `<sc-tab-group></sc-tab-group>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
