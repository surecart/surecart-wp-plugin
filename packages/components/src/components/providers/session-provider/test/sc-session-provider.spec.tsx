import { ScSessionProvider } from '../sc-session-provider';
import { newSpecPage } from '@stencil/core/testing';
import { parseFormData } from '../../../../functions/form-data';

jest.mock('../../../../services/session', () => ({
  createOrUpdateOrder: () => Promise.resolve(),
  finalizeSession: () => Promise.resolve(),
}));

describe('sc-cart-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSessionProvider],
      html: `<sc-session-provider></sc-session-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('redirects when the order is paid', async () => {});

  describe('Methods', () => {
    it('parseFormData', async () => {
      expect(
        parseFormData({
          email: 'test@test.com',
          name: 'test',
          password: 'password',
          meta_item: 'test',
        }),
      ).toEqual({
        email: 'test@test.com',
        password: 'password',
        name: 'test',
        metadata: { meta_item: 'test' },
      });
    });

    it('getSessionId', async () => {
      const provider = new ScSessionProvider() as any;
      provider.order = { id: 'test' };
      expect(provider.getSessionId()).toEqual('test');
    });
  });
});
