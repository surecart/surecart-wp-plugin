import { newSpecPage } from '@stencil/core/testing';
import { ScMenuItem } from '../sc-menu-item';

describe('sc-menu-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScMenuItem],
      html: `<sc-menu-item></sc-menu-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
