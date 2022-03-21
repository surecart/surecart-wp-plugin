import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionStatusBadge } from '../sc-subscription-status-badge';

describe('sc-subscription-status-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionStatusBadge],
      html: `<sc-subscription-status-badge></sc-subscription-status-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
