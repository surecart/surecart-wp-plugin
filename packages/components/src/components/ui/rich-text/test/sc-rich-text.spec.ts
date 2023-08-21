import { newSpecPage } from '@stencil/core/testing';
import { ScRichText } from '../sc-rich-text';

describe('sc-rich-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScRichText],
      html: `<sc-rich-text></sc-rich-text>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
