import { newSpecPage } from '@stencil/core/testing';
import { CeEmpty } from '../ce-empty';

describe('ce-empty', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeEmpty],
      html: `<ce-empty></ce-empty>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
