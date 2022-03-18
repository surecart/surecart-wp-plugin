import { newSpecPage } from '@stencil/core/testing';
import { CePriceChoice } from '../ce-price-choice';

describe('ce-price-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceChoice],
      html: `<ce-price-choice></ce-price-choice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
