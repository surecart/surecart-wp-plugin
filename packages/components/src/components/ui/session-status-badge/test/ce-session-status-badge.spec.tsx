import { newSpecPage } from '@stencil/core/testing';
import { CeSessionStatusBadge } from '../ce-session-status-badge';

describe('ce-session-status-badge', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSessionStatusBadge],
      html: `<ce-session-status-badge></ce-session-status-badge>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
