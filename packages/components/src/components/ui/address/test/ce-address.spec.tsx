import { newSpecPage } from '@stencil/core/testing';
import { CeAddress } from '../ce-address';

describe('ce-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeAddress],
      html: `<ce-address></ce-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
