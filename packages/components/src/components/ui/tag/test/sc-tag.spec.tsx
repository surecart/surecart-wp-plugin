import { newSpecPage } from '@stencil/core/testing';
import { ScTag } from '../sc-tag';

describe('sc-tag', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScTag],
      html: `<sc-tag></sc-tag>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
