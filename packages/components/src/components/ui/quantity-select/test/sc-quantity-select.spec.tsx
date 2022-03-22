import { newSpecPage } from '@stencil/core/testing';
import { ScQuantitySelect } from '../sc-quantity-select';

describe('sc-quantity-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScQuantitySelect],
      html: `<sc-quantity-select></sc-quantity-select>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
