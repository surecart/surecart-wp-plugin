import { newSpecPage } from '@stencil/core/testing';
import { ScText } from '../sc-text';

describe('sc-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScText],
      html: `<sc-text></sc-text>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
