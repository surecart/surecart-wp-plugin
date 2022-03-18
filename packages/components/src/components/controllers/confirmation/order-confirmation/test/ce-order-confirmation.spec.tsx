import { newSpecPage } from '@stencil/core/testing';
import { CeOrderConfirmation } from '../ce-order-confirmation';

describe('ce-order-confirmation', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderConfirmation],
      html: `<ce-order-confirmation></ce-order-confirmation>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
