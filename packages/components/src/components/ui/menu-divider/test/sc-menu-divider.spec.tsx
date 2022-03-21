import { newSpecPage } from '@stencil/core/testing';
import { ScMenuDivider } from '../sc-menu-divider';

describe('sc-menu-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScMenuDivider],
      html: `<sc-menu-divider></sc-menu-divider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
