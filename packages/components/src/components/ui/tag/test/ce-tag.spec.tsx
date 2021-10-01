import { newSpecPage } from '@stencil/core/testing';
import { CeTag } from '../ce-tag';

describe('ce-tag', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTag],
      html: `<ce-tag></ce-tag>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
