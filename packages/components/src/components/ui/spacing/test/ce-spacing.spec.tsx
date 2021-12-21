import { newSpecPage } from '@stencil/core/testing';
import { CeSpacing } from '../ce-spacing';

describe('ce-spacing', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSpacing],
      html: `<ce-spacing></ce-spacing>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
