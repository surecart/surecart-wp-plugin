import { newSpecPage } from '@stencil/core/testing';
import { ScOrderStatusBadge } from '../sc-order-status-badge';

describe('sc-order-status-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderStatusBadge],
      html: `<sc-order-status-badge></sc-order-status-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
