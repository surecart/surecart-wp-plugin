import { newSpecPage } from '@stencil/core/testing';
import { ScCartIcon } from '../sc-cart-icon';

describe('sc-cart-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCartIcon],
      html: `<sc-cart-icon></sc-cart-icon>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
