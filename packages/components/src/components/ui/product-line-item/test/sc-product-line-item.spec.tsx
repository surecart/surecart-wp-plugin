import { newSpecPage } from '@stencil/core/testing';
import { ScProductLineItem } from '../sc-product-line-item';

describe('sc-product-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItem],
      html: `<sc-product-line-item currency="CAD" amount="1000"></sc-product-line-item>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
