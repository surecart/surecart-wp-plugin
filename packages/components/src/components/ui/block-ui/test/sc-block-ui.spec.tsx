import { newSpecPage } from '@stencil/core/testing';
import { ScBlockUi } from '../sc-block-ui';

describe('sc-block-ui', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScBlockUi],
      html: `<sc-block-ui></sc-block-ui>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
