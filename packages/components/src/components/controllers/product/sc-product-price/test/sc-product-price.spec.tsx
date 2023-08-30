import { newSpecPage } from '@stencil/core/testing';
import { ScProductPrice } from '../sc-product-price';

describe('sc-product-prices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductPrice],
      html: `<sc-product-price></sc-product-price>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('aligns the text to the left when textAlign is left', async () => {
    const page = await newSpecPage({
      components: [ScProductPrice],
      html: `<sc-product-price text-align="left"></sc-product-price>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('aligns the text to the center when textAlign is center', async () => {
    const page = await newSpecPage({
      components: [ScProductPrice],
      html: `<sc-product-price text-align="center"></sc-product-price>`,
    });
    expect(page.root).toMatchSnapshot();
  })

  it('aligns the text to the right when textAlign is right', async () => {
    const page = await newSpecPage({
      components: [ScProductPrice],
      html: `<sc-product-price text-align="right"></sc-product-price>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
