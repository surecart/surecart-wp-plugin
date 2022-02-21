import { newSpecPage } from '@stencil/core/testing';
import { CeOrderConfirmationLineItems } from '../ce-order-confirmation-line-items';

describe('ce-order-confirmation-line-items', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderConfirmationLineItems],
      html: `<ce-order-confirmation-line-items></ce-order-confirmation-line-items>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
