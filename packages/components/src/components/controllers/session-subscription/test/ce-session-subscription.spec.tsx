import { newSpecPage } from '@stencil/core/testing';
import { CeSessionSubscription } from '../ce-session-subscription';

describe('ce-session-subscription', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSessionSubscription],
      html: `<ce-session-subscription></ce-session-subscription>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
