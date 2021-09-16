import { newSpecPage } from '@stencil/core/testing';
import { CECheckout } from '../ce-checkout';

describe('ce-checkout', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CECheckout],
      html: `<ce-checkout></ce-checkout>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
