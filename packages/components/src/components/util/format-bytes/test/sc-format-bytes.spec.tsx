import { newSpecPage } from '@stencil/core/testing';
import { ScFormatBytes } from '../sc-format-bytes';

describe('sc-format-bytes', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScFormatBytes],
      html: `<sc-format-bytes></sc-format-bytes>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
