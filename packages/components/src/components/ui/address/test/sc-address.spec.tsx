import { newSpecPage } from '@stencil/core/testing';
import { ScAddress } from '../sc-address';

describe('sc-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScAddress],
      html: `<sc-address></sc-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
