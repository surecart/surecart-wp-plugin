import { newSpecPage } from '@stencil/core/testing';
import { CeSessionProvider } from '../ce-session-provider';

describe('ce-cart-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSessionProvider],
      html: `<ce-session-provider></ce-session-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
