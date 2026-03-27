import { newSpecPage } from '@stencil/core/testing';
import { ScProductLineItemNote } from '../sc-product-line-item-note';

describe('sc-product-line-item-note', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductLineItemNote],
      html: `<sc-product-line-item-note></sc-product-line-item-note>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
