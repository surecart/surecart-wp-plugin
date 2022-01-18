import { newSpecPage } from '@stencil/core/testing';
import { CeOrderStatusBadge } from '../ce-order-status-badge';

describe('ce-order-status-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeOrderStatusBadge],
      html: `<ce-order-status-badge></ce-order-status-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
