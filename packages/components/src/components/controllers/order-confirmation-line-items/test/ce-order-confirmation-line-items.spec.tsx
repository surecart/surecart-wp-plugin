import { newSpecPage } from '@stencil/core/testing';
import { CeOrderConfirmationSummary } from '../ce-order-confirmation-line-items';

describe('ce-order-confirmation-summary', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderConfirmationSummary],
      html: `<ce-order-confirmation-summary></ce-order-confirmation-summary>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
