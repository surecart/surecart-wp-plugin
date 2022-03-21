import { newSpecPage } from '@stencil/core/testing';
import { ScOrderConfirmation } from '../sc-order-confirmation';

describe('sc-order-confirmation', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderConfirmation],
      html: `<sc-order-confirmation></sc-order-confirmation>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
