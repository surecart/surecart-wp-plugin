import { newSpecPage } from '@stencil/core/testing';
import { ScIcon } from '../sc-icon';

describe('sc-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScIcon],
      html: `<sc-icon></sc-icon>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
