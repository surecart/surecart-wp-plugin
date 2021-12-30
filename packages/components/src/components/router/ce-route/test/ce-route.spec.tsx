import { newSpecPage } from '@stencil/core/testing';
import { CeRoute } from '../ce-route';

describe('ce-route', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeRoute],
      html: `<ce-route></ce-route>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
