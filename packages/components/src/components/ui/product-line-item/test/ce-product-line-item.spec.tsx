import { newSpecPage } from '@stencil/core/testing';
import { CeProductLineItem } from '../ce-product-line-item';

describe('ce-product-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeProductLineItem],
      html: `<ce-product-line-item currency="CAD" amount="1000"></ce-product-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
