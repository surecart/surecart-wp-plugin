import { newSpecPage } from '@stencil/core/testing';
import { CEOrderSummary } from '../sc-order-summary';

describe('sc-order-summary', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEOrderSummary],
      html: `<sc-order-summary></sc-order-summary>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
