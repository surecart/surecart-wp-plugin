import { newSpecPage } from '@stencil/core/testing';
import { CeText } from '../ce-text';

describe('ce-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeText],
      html: `<ce-text></ce-text>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
