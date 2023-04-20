import { newSpecPage } from '@stencil/core/testing';
import { ScImageSlider } from '../sc-image-slider';

describe('sc-image-slider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScImageSlider],
      html: `<sc-image-slider></sc-image-slider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
