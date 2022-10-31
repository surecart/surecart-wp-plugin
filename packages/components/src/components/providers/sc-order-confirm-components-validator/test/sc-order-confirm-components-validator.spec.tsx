import { newSpecPage } from '@stencil/core/testing';
import { ScOrderConfirmComponentsValidator } from '../sc-order-confirm-components-validator';

describe('sc-order-confirm-components-validator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderConfirmComponentsValidator],
      html: `<sc-order-confirm-components-validator></sc-order-confirm-components-validator>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
