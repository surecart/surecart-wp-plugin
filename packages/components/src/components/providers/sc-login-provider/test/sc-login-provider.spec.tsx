import { newSpecPage } from '@stencil/core/testing';
import { ScLoginProvider } from '../sc-login-provider';

describe('sc-login-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLoginProvider],
      html: `<sc-login-provider></sc-login-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
