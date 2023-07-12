import { newSpecPage } from '@stencil/core/testing';
import { ScProductCollectionBadge } from '../sc-product-collection-badge';


describe('sc-product-collection-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductCollectionBadge],
      html: `<sc-product-collection-badge></sc-product-collection-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
