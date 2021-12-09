import { newSpecPage } from '@stencil/core/testing';
import { CeSubscriptionStatusBadge } from '../ce-subscription-status-badge';

describe('ce-subscription-status-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSubscriptionStatusBadge],
      html: `<ce-subscription-status-badge></ce-subscription-status-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
