import { newSpecPage } from '@stencil/core/testing';
import { CEMenuDivider } from '../sc-menu-divider';

describe('sc-menu-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEMenuDivider],
      html: `<sc-menu-divider></sc-menu-divider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
