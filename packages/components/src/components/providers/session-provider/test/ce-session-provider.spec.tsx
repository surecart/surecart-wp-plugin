import { CeSessionProvider } from '../ce-session-provider';
import { newSpecPage } from '@stencil/core/testing';

jest.mock('../../../../services/session', () => ({
  createOrUpdateOrder: () => Promise.resolve(),
  finalizeSession: () => Promise.resolve(),
}));

describe('ce-cart-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSessionProvider],
      html: `<ce-session-provider></ce-session-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('redirects when the order is paid', async () => {});

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
      provider.order = { id: 'test' };
      expect(provider.getSessionId()).toEqual('test');
    });
  });
});
