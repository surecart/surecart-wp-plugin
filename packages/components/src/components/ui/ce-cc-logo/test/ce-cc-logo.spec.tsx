import { newSpecPage } from '@stencil/core/testing';
import { CeCcLogo } from '../ce-cc-logo';

describe('ce-cc-logo', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCcLogo],
      html: `<ce-cc-logo></ce-cc-logo>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
