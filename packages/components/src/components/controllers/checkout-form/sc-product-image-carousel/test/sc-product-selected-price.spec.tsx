import { newSpecPage } from '@stencil/core/testing';
import { ScProductImageCarousel } from '../sc-product-image-carousel';

describe('sc-product-image-carousel', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductImageCarousel],
      html: `<sc-product-image-carousel></sc-product-image-carousel>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
