import { MockResponse, mockFetch, newSpecPage, MockHeaders } from '@stencil/core/testing';
import { CeSessionProvider } from '../ce-session-provider';

describe('ce-cart-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSessionProvider],
      html: `<ce-session-provider></ce-session-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  describe('Methods', () => {
    it('parseFormData', async () => {
      const provider = new CeSessionProvider();
      expect(
        provider.parseFormData({
          email: 'test@test.com',
          name: 'test',
          password: 'password',
          meta_item: 'test',
        }),
      ).toEqual({
        email: 'test@test.com',
        name: 'test',
        password: 'password',
        metadata: { meta_item: 'test' },
      });
    });

    it('getSessionId', async () => {
      const provider = new CeSessionProvider();
      provider.checkoutSession = { id: 'test' };
      expect(provider.getSessionId()).toEqual('test');
    });
  });
});
